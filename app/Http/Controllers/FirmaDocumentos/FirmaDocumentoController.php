<?php

namespace App\Http\Controllers\FirmaDocumentos;
use App\Http\Controllers\Controller;
use QrCode;
use DB;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Log;
use App\FirmarDocumentos\FirmarDocumentosModel;
use App\FirmarDocumentos\ParametroHojaModel;
use PDF;
use Storage;
use App\BSrE_PDF_Signer_Cli;
use App\Http\Controllers\FirmarDocumentoManualesController;
use App\Http\Controllers\FirmaDocumentos\EdicionPdfController;
use ZipArchive;
use App\FirmaElectronicaModel;
use App\ParametrosGeneralesModel;
use Hamcrest\Description;
use Imagick;
use SplFileInfo;

class FirmaDocumentoController extends Controller
{   

    private $dataFirma = null;

    public function __construct()
    {
        try{              
            $this->dataEdicion = new EdicionPdfController();         
        } catch (\Throwable $e) {
            Log::error('FirmaDocumentoController => construct'.$e->getMessage());
        }

    }
   
    public function index(){

        $ListaInforme=FirmarDocumentosModel::all();        

        return view('firmarDocumentos.index',[
                'ListaInforme'=> $ListaInforme,
                
        ]);

    }

    public function nuevoDocumento(Request $request){
        $transaction=DB::transaction(function() use ($request){
            try {        
                $archivo=$request->archivo;
                if(is_null($archivo)){
                    return back()->with(['mensajePInfoDocumento'=>'Debe subir un documento','error'=>'danger']);
                }
                //obtenemos los datos de los documentos
                $extension = pathinfo($archivo->getClientOriginalName(), PATHINFO_EXTENSION);
                if($extension!='pdf'){
                    return back()->with(['mensajePInfoDocumento'=>'Debe subir un documento en formato PDF','error'=>'danger']);
                }
                //verficamos si viene el iddocumento si viene es porque es edicion(actualizacion)
                $iddocumento=$request->iddocumento;
                if(!is_null($iddocumento)){
                    $actualizaDoc= FirmarDocumentosModel::find($iddocumento);
                    $nom_arch="archivo_".md5(date('Y-m-dH:i:s'));
                    $nombreDocumento=$nom_arch.'.pdf';
                    $nombreDocRespaldo=$nom_arch."_copia.pdf";
                    
                    Storage::disk('public')->put(str_replace("", "",$nombreDocumento), \File::get($archivo)); // guardamos el documento
                    Storage::disk('public')->put(str_replace("", "",$nombreDocRespaldo), \File::get($archivo)); // guardamos el documento resp
                   
                    $exists = Storage::disk('public')->exists($nombreDocumento);
                    if($exists){
                        //eliminamos el documento anterior
                        Storage::disk('public')->delete($actualizaDoc->documento);

                        $actualizaDoc->descripcion=$request->descripcion;
                        $actualizaDoc->firmado="No";
                        $actualizaDoc->documento=$nombreDocumento;
                        $actualizaDoc->respaldo=$nombreDocRespaldo;
                        $actualizaDoc->save();                    

                        return back()->with(['mensajePInfoDocumento'=>'Documento actualizado correctamente','correcto'=>'success']);
                       
                    }else{
                        return back()->with(['mensajePInfoDocumento'=>'No se pudo actualizar el documento','error'=>'danger']);
                    }
                }else{
                    $guardarDoc= new FirmarDocumentosModel();
                    $nom_arch="archivo_".md5(date('Y-m-dH:i:s'));
                    $nombreDocumento=$nom_arch.'.pdf';
                    $nombreDocRespaldo=$nom_arch."_copia.pdf";
                    
                    Storage::disk('public')->put(str_replace("", "",$nombreDocumento), \File::get($archivo)); // guardamos el documento
                    Storage::disk('public')->put(str_replace("", "",$nombreDocRespaldo), \File::get($archivo)); // guardamos el documento
                   
                    $exists = Storage::disk('public')->exists($nombreDocumento);
                    if($exists){
                        $guardarDoc->descripcion=$request->descripcion;
                        $guardarDoc->firmado="No";
                        $guardarDoc->documento=$nombreDocumento;
                        $guardarDoc->respaldo=$nombreDocRespaldo;
                        $guardarDoc->save();
                        return back()->with(['mensajePInfoDocumento'=>'Documento subido correctamente','correcto'=>'success']);
                       
                    }else{
                        return back()->with(['mensajePInfoDocumento'=>'No se pudo guardar el documento','error'=>'danger']);
                    }
                }

               
            } catch (\Throwable $e) {
                DB::rollback();
                Log::error(__CLASS__." => ".__FUNCTION__." => Mensaje =>".$e->getMessage());
                return back()->with(['mensajePInfoDocumento'=>'Ocurrió un error, al subir el nuevo documento, intentelo más tarde','error'=>'danger']);
               
            }
        });
        return ($transaction);

    }

    public function eliminarDocumento($id){
        $transaction=DB::transaction(function() use ($id){
            try {        
                
                $eliminarDoc= FirmarDocumentosModel::find($id);
               
                $exists = Storage::disk('public')->exists($eliminarDoc->documento);
                if($exists){
                    Storage::disk('public')->delete($eliminarDoc->documento);
                    Storage::disk('public')->delete($eliminarDoc->respaldo);
                    $eliminarDoc->delete();
                    return back()->with(['mensajePInfoDocumento'=>'Documento eliminado correctamente','correcto'=>'success']);
                   
                }else{
                    return back()->with(['mensajePInfoDocumento'=>'No se pudo eliminar el documento','error'=>'danger']);
                }
            } catch (\Throwable $e) {
                DB::rollback();
                Log::error(__CLASS__." => ".__FUNCTION__." => Mensaje =>".$e->getMessage());
                return back()->with(['mensajePInfoDocumento'=>'Ocurrió un error, al eliminar el documento, intentelo más tarde','error'=>'danger']);
               
            }
        });
        return ($transaction);
    }


    public function listadoDocumento(){
     
        try {        
            $cargaDocumento=FirmarDocumentosModel::get();
            return response()->json([
                "error"=>false,
                "resultado"=>$cargaDocumento,
               
            ]); 
        } catch (\Throwable $e) {
            Log::error(__CLASS__." => ".__FUNCTION__." => Mensaje =>".$e->getMessage());
            return response()->json([
                "error"=>true,
                "mensaje"=>'Ocurrió un error',
               
            ]); 
        }

    }

    public function simulacionFirma(Request $request){
        // dd($request->all());
        $transaction=DB::transaction(function() use ($request){
            try{

                $nombre_archivo_certificado="LLAMA-PE-CERTIFICADO-DEMO-1315139483.p12";
                $clave_certificado="123456789";
                
                $ruta_base = base_path();
                $ruta_base =str_replace("\\","/",$ruta_base);
                $archivocert=storage_path('/app/documentosFirmar/'.$nombre_archivo_certificado);
               

                $info_archivop12 = $this->obtenerInformacionCertificado(file_get_contents($archivocert), $clave_certificado);

                if($info_archivop12['error']==true){
                    // $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);                              
                    $mensajeError = $info_archivop12['mensaje'];
                    return response()->json([
                        'error'=>true,
                        'mensaje'=>$mensajeError,
                    
                    ]);
                }

                //nombre de la persona que firma el documento
                $nombre_firma=$info_archivop12['datos_cert'];

                $idarchivo=$request->documnento_id_conf;
                $archivo=FirmarDocumentosModel::where('idcoact_firma_documentos',$idarchivo)->first();
                
                //si existe un paramentro lo borramos
                $exite_parametro=ParametroHojaModel::where('idfirma_parametros','!=',null)->first();
                if(!is_null($exite_parametro)){
                    $exite_parametro->delete();
                }

                if($request->pagina=="P"){
                    $pagina_selecc="P";
                }elseif($request->pagina=="U"){
                    $pagina_selecc="U";
                }else{
                    $pagina_selecc=$request->num_pag;
                      
                }
                //registramos los datos de la hoja en la bd
                $guardaParametro=new ParametroHojaModel();
                $guardaParametro->formato=$request->formato;
                $guardaParametro->orientacion=$request->orientacion;
                $guardaParametro->coordenada_x=$request->x;
                $guardaParametro->coordenada_y=$request->y;
                $guardaParametro->hoja_firma=$pagina_selecc;
                $guardaParametro->save();

                //para agregar el texto firmado electronicamente
                $editar=$this->dataEdicion->simular_edicion($archivo->documento,$nombre_firma,$razon="sinrazon",$localizacion="sinloca",$request->all()); 

                if($editar['error']==true){ 
                    DB::rollback();                    
                    $mensajeError = $editar['mensaje'];
                    return response()->json([
                        'error'=>true,
                        'mensaje'=>$mensajeError,
                    
                    ]);

                }else{
                    return response()->json([
                        'error'=>false,
                        'mensaje'=>"Configuración Correcta",
                        'archivo'=>$archivo->respaldo
                    
                    ]);
                }
        
            } catch (\Throwable $e) {
                DB::rollback();
                Log::error(__CLASS__." => ".__FUNCTION__." => Mensaje =>".$e->getMessage());
                return response()->json([
                    "error"=>true,
                    "mensaje"=>'Ocurrió un error',
                
                ]); 
            }
        });
        return ($transaction);
    }

    

    public function generar(Request $request){
       
        try{
  
            if(isset($request->list_cod_documento)){
  
              
                set_time_limit(0);
                ini_set("memory_limit",-1);
                ini_set('max_execution_time', 0);

             
                $razon=$request->input_razon;
                $visible=$request->check_filtrar_visible;             

                $localizacion=$request->input_localizacion;
                $cantidad_generar=0;
                $cantidad_generar=sizeof($request->list_cod_documento);
                $cantidad_generados=0;

                $list_nombre_documento_firmar=[];           
                $nombre_archivo_certificado = ""; // nombre del archivo certificado (.p12)
                $clave_certificado = ""; // la contraseña del archivo certificado (.p12)
                $prefijofinal = "_firmado"; // prefijo para el documento firmado (vacio para que se sobre escriba el documento)
                $mensajeError = ""; // para almacenar el error
                $firma_configurada = false; // para verificar si tiene archivo de certificado
  
                $objFirmDocManual = new FirmarDocumentoManualesController();  
  
                $idus001 = auth()->user()->idus001;
                $firma_electronica_conf = FirmaElectronicaModel::where('idus001', $idus001)->first();
  
                if(!is_null($firma_electronica_conf)){
                    if(!is_null($firma_electronica_conf->archivo_certificado)){

                        //obtenemos los dias validos del certificado cardago
                        $fecha_actual = date('Y-m-d H:i:s');
                        $fecha_hasta = $firma_electronica_conf->fecha_hasta;
                        $dias_valido = (strtotime($fecha_actual)-strtotime($fecha_hasta))/86400;
                        if(strtotime($fecha_actual)>=strtotime($fecha_hasta)){ $dias_valido=0;}
                        $dias_valido = abs($dias_valido); 
                        $dias_valido = floor($dias_valido);

                        //obtenemos los días mínimo de vigencia de certificado para firmar documentos
                        $dias_permitir_firmar = 1;
                        $permitir_firmar = ParametrosGeneralesModel::where('codigo','MINPERFIRMAR')->pluck('valor')->first();
                        if(!is_null($permitir_firmar)){ if($permitir_firmar>1){ $dias_permitir_firmar = $permitir_firmar; } }

                        if($dias_valido >= $dias_permitir_firmar){
                            $firma_configurada = true; // tiene el archivo del certificado cargado
                        }
                    }
                } 
  
                    // ----------------- obtenemos la contraseña del certificado ------------------------------------

                if($firma_configurada){
                    if(!is_null($firma_electronica_conf->clave_certificado)){ // si tiene clave
                        $clave_certificado = decrypt($firma_electronica_conf->clave_certificado);
                    }else{
                        goto FIRMAINGRESADA;
                    }
                }else{
                    FIRMAINGRESADA:
                    if(isset($request->clave_certificado)){
                        $clave_certificado = $request->clave_certificado;
                    }else{
                        $mensajeError = "Contraseña del certificano no enviada";
                        // goto RETORNARERROR;
                        return response()->json([
                            'error'=>true,
                            'mensaje'=>$mensajeError
                        ]);
                            
                    }                       
                }


                // ----------------- almacenamos temporalmente el archivo certificado ---------------------------

                if($firma_configurada){
                    $nombre_archivo_certificado = $firma_electronica_conf->archivo_certificado;
                    $archivo_certificado_conf = Storage::disk('disksServidorSFTPcertificado_p12')->get($nombre_archivo_certificado); // obtenemos el archivo cargado
                    Storage::disk('disksDocumentosFirmados')->put(str_replace("", "",$nombre_archivo_certificado), $archivo_certificado_conf); // pasamos el documento a la carpeta temporal
                }else{
                    if(isset($request->archivo_certificado)){
                        $archivo_certificado = $request->archivo_certificado;
                        $extension = pathinfo($archivo_certificado->getClientOriginalName(), PATHINFO_EXTENSION);
                        if($extension != "p12"){ 
                            $mensajeError="El archivo del certificado debe ser formato .p12"; 
                            //goto RETORNARERROR; 
                            return response()->json([
                                'error'=>true,
                                'mensaje'=>$mensajeError
                            ]);
                        }
                        $nombre_archivo_certificado = $archivo_certificado->getClientOriginalName();
                        $nombre_archivo_certificado = "certif_".md5($nombre_archivo_certificado.$idus001).".$extension";
                        Storage::disk('disksDocumentosFirmados')->put($nombre_archivo_certificado,  \File::get($archivo_certificado));
                    }else{

                        $mensajeError = "Archivo certificado no enviado"; 
                        //goto RETORNARERROR;
                        return response()->json([
                            'error'=>true,
                            'mensaje'=>$mensajeError
                        ]);
                            
                    }                    
                }

        
                foreach($request->list_cod_documento as $key => $id) {
                   
                    $codigo = $id;    
                    $consultaInforme=FirmarDocumentosModel::where('idcoact_firma_documentos',$codigo)->first();
                    $archivo=$consultaInforme->documento;      
                                      
                
                    $exists = Storage::disk('public')->exists($archivo);
                    //si existe el archivo
                    if($exists){   
                        
                        $nombrePDF=$archivo;
                        array_push($list_nombre_documento_firmar, $nombrePDF);  

                        if($visible=='on'){

                            $ruta_base = base_path();
                            $ruta_base =str_replace("\\","/",$ruta_base);
                            $archivocert=storage_path('/app/documentosFirmar/'.$nombre_archivo_certificado);
        
                            $info_archivop12 = $this->obtenerInformacionCertificado(file_get_contents($archivocert), $clave_certificado);

                            if($info_archivop12['error']==true){
                                $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);                              
                                $mensajeError = $info_archivop12['mensaje'];
                                return response()->json([
                                    'error'=>true,
                                    'mensaje'=>$mensajeError,
                                    'exist'=>$codigo
                                ]);
                            }

                            //nombre de la persona que firma el documento
                            $nombre_firma=$info_archivop12['datos_cert'];
                            
                            //verfico si hay datos previos de configuracion de la firma
                            $datosHojas=ParametroHojaModel::first();
                            if(is_null($datosHojas)){
                                $mensajeError = "No existen datos previos de configuración de firma del documento";
                                return response()->json([
                                    'error'=>true,
                                    'mensaje'=>$mensajeError,
                                    'exist'=>$codigo
                                ]);
                            }

                            //para agregar el texto firmado electronicamente
                            $editar=$this->dataEdicion->crear_edicion($archivo,$nombre_firma,$razon,$localizacion); 
                                                        
                            if($editar==false){
                                $mensajeError = "No se pudo firmaeralgunos documentos";
                                return response()->json([
                                    'error'=>true,
                                    'mensaje'=>$mensajeError,
                                    'exist'=>$codigo
                                ]);

                            }  

                            //pasamos el documento a la carpeta para firmar
                            $documentoListo = Storage::disk('public')->get($archivo); // obtenemos el documento del servidor sftp
                            Storage::disk('disksDocumentosFirmados')->put(str_replace("", "",$archivo), $documentoListo); // guardamos locammente el documeto a firmar 


                            $status_firma = $this->firmarDocumento($nombrePDF, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, "public",$razon,$localizacion,$nombre_firma);
                            if($status_firma['error']==false){ 
                        
                                #si hay error borramos los documentos                               
                                $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);                              

                                $mensajeError = "No se pudo firmar algunos documentos";
                                return response()->json([
                                    'error'=>true,
                                    'mensaje'=>$mensajeError,
                                    'exist'=>$codigo
                                ]);

                                
                            }
            
                            // $consultaInforme->firmado="Si";
                            $consultaInforme->save();
                            $cantidad_generados++;

                        }else{

                            //pasamos el documento a la carpeta para firmar
                            $documentoListo = Storage::disk('public')->get($archivo); // obtenemos el documento del servidor sftp
                            Storage::disk('disksDocumentosFirmados')->put(str_replace("", "",$archivo), $documentoListo); // guardamos locammente el documeto a firmar 

                            $status_firma = $this->firmarDocumentoInvisible($nombrePDF, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, "public",$razon,$localizacion);
                            if($status_firma['error']==false){ 
                        
                                #si hay error borramos los documentos                               
                                $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);                              

                                $mensajeError = "No se pudo firmar algunos documentos";
                                return response()->json([
                                    'error'=>true,
                                    'mensaje'=>$mensajeError,
                                    'exist'=>$codigo
                                ]);

                                
                            }
                            
                            // $consultaInforme->firmado="Si";
                            $consultaInforme->save();
                            $cantidad_generados++;

                        }                          
                            
                    }else{

                        $mensajeError = "El documento no fué encontrado";
                        return response()->json([
                            'error'=>true,
                            'mensaje'=>$mensajeError,
                            'exist'=>$exists
                            
                        ]);

                    }   
                        

                }

                $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);   

                return response()->json([
                'error'=>false,
                'mensaje'=>"Documento(s) aprobados y firmados",
                'cantidad_generados'=>$cantidad_generados,
                'cantidad_generar'=>$cantidad_generar,
                'archivo'=>$archivo,
                'id'=>$codigo
                ]);  
                        
            }

        }catch(\Throwable $th){        
            Log::error("FirmaDocumentoController => generar => Mensaje: ".$th->getMessage()."Linea: ".$th->getLine());
            $objFirmDocManual->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);    
            return response()->json([
                'error'=>true,
                'mensaje'=>"Ocurrió un error"
            ]); 
        }
             
    }
  


   // función para verificar la configuración de la firma
    public function verificarConfigFirmado(){

        try{

            $mensajeError = "";
                $config_firma = [
                    "archivo_certificado"=>false, // no hay archivo agregado
                    "clave_certificado"=>false, // no hay clave registrada
                    "dias_valido"=>0, // el numero de dias validos del certificado cargado
                    "dias_notific_expira"=>10, // si un certificado tiene estos dia de vigencia, se notifica que esta por expirar
                    "dias_permitir_firmar"=>1, // días mínimo de vigencia de certificado para firmar documentos
                ];

            // ------------- obtenemos la firma del usuario ---------

                $firma_electronica = FirmaElectronicaModel::where('idus001', auth()->user()->idus001)->first();

                if(!is_null($firma_electronica)){ // ya se registró una firma en base de datos

                    if(!is_null($firma_electronica->archivo_certificado)){
                        $config_firma["archivo_certificado"] = true; // hay un archivo agregado
                        
                        //obtenemos los dias validos del certificado cardago
                        $fecha_actual = date('Y-m-d H:i:s');
                        $fecha_hasta = $firma_electronica->fecha_hasta;
                        $dias_valido = (strtotime($fecha_actual)-strtotime($fecha_hasta))/86400;
                        if(strtotime($fecha_actual)>=strtotime($fecha_hasta)){ $dias_valido=0;}
                        $dias_valido = abs($dias_valido); 
                        $dias_valido = floor($dias_valido);
                        $config_firma["dias_valido"] = $dias_valido;

                        //obtenemos los dias que se considera que un certificado esta por expirar
                        $dias_notific_expira = ParametrosGeneralesModel::where('codigo','NOTEXPIRCER')->pluck('valor')->first();
                        if(!is_null($dias_notific_expira)){ $config_firma["dias_notific_expira"] = $dias_notific_expira; }

                        //obtenemos los días mínimo de vigencia de certificado para firmar documentos
                        $dias_permitir_firmar = ParametrosGeneralesModel::where('codigo','MINPERFIRMAR')->pluck('valor')->first();
                        if(!is_null($dias_permitir_firmar)){ if($dias_permitir_firmar>1){ $config_firma["dias_permitir_firmar"] = $dias_permitir_firmar; } }
    
                    }

                    if(!is_null($firma_electronica->clave_certificado)){
                        $config_firma["clave_certificado"] = true;  // hay una clave registrada
                    }

                }

            // ------------------------------


                return response()->json([
                    "error" => false,
                    "config_firma" => $config_firma
                ]);
         
            
            RETORNARERROR:
                return response()->json([
                    "error" => true,
                    "mensaje" => $mensajeError,
                    "status" => "error"
                ]);

        }catch (\Throwable $th){
            Log::error("FirmaDocumentoController => verificarConfigFirmado => Mensaje:".$th->getMessage());
            return response()->json([
                "error" => true,
                "mensaje" => "No se pudo verificar la configuración de la firma electrónica",
                "status" => "error"
            ]);
        }


    }

    
    //creacion del tirulo de credito en pdf
    public function documento_crear($id,$archivo){
          
    	try {
          
            $pdf = PDF::loadView('firmarDocumentos.pdfPrueba',['data'=>$id,'nombre'=>$archivo]);
            $pdf->setPaper("A4", "portrait");
            $nombrepdf=$archivo;
            $documento = $pdf;

            Storage::disk("public")->put($nombrepdf, $documento->output());
            return ['error'=>false,'nombre_pdf'=>$nombrepdf,'docpdf'=>$documento];
          
    	
        }catch (\Throwable $th){
            Log::error("FirmaDocumentoController => documento_crear => Mensaje:".$th->getMessage());
            return ['error'=>true,'mensaje'=>'no se pudo generar el titulo'];
    	}

    }

 

    // recibe la ruta de un certificado.p12 y la contraseña y retorna la informacion del pripietario de la firma
    public function obtenerInformacionCertificado($archivo_p12, $clave){

        try {

            $pkcs12File = @file_get_contents($archivo_p12);
       
            if(false === $pkcs12File){
               
                return ['error'=>true,'mensaje'=>'Archivo de certificado no encontrado'];
            }

            $p12Read = openssl_pkcs12_read(
                $archivo_p12,
                $pkcs12,
                $clave
            );

            if(false === $p12Read) {
                return ['error'=>true,'mensaje'=>'Frase de contraseña incorrecta'];
            
            }

            $datos_certificado = [];
            $informacion_archivo = array();
    
            if (openssl_pkcs12_read($archivo_p12, $informacion_archivo, $clave)) {
                if (isset($informacion_archivo['cert'])) {
                    openssl_x509_export($informacion_archivo['cert'], $informacion_archivo);   
                    $informacion_archivo = openssl_x509_parse($informacion_archivo);
                    $datos_certificado["fecha_de"] = date('Y-m-d H:i:s', $informacion_archivo['validFrom_time_t']);
                    $datos_certificado["fecha_hasta"] = date('Y-m-d H:i:s', $informacion_archivo['validTo_time_t']);
                    $datos_certificado["propietario"] = $informacion_archivo["subject"]["CN"];
                    
                }
            }
    
            // return $datos_certificado["propietario"];
            return ['error'=>false,'datos_cert'=> $datos_certificado["propietario"]];
     

        }catch(\Throwable $th){
            return $th->getMessage();;
        }

    }

    // función que realiza el proceso de firma electronica invisible
    public function firmarDocumentoInvisible($nombre_documento_firmar, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, $discoDocumento,$razon,$localizacion){

        try{

            $ruta_base = base_path();
            $ruta_base =str_replace("\\","/",$ruta_base);

            $pdfSigner =  new BSrE_PDF_Signer_Cli();
            $pdfSigner->addmultipleSign();
            $pdfSigner->setDocument($ruta_base.'/storage/app/documentosFirmar/'.$nombre_documento_firmar);
            $pdfSigner->setLibraryPath($ruta_base.'/app/JSignPDF/library');
            $pdfSigner->readCertificateFromFile(
                $ruta_base.'/storage/app/documentosFirmar/'.$nombre_archivo_certificado,
                $clave_certificado
            );
            $pdfSigner->setCertificationLevel(2);
            $pdfSigner->setSuffixFileName($prefijofinal);
            
            $pdfSigner->setDirectory('/storage/app/documentosFirmar', false); 
            

            if($razon!=null){
                $pdfSigner->setReason($razon);
            }
            if($localizacion!=null){
                $pdfSigner->setLocation($localizacion);
            }
           
            $pdfSigner->setAppearance(
           
                $position = array(
                    
                   
                    'llx' => '10', //inferior izquierda X
                    'lly' => '40', //inferior izquierda Y
                    'urx' => '50', //superior derecha X 
                    'ury' => '90'  //superior derecha Y
                ),

                $page = 1000, // para que lo ponga al final
                $spesimen = null, // imagen de fondo
                $bgscale = -1, // estala de imagen de fondo
                $fontsize = 8, // tamaño de fuente
                $text = false, // mostrar el sello de la firma
                // $content_text = '',
                $content_text = '',
               
            );            
       
            if($pdfSigner->sign()){

                //proceso pasar documento firmado al disco origen
                
                    $aux_nombre_documento_firmar = pathinfo($nombre_documento_firmar, PATHINFO_FILENAME);
                    $extension = pathinfo($nombre_documento_firmar, PATHINFO_EXTENSION);
                    
                    $exists = Storage::disk('disksDocumentosFirmados')->exists($aux_nombre_documento_firmar.$prefijofinal.".".$extension); //buscamos el documento firmado
                    if($exists){                
                        //pasamos el documento firmado
                        $documento_firmado = Storage::disk('disksDocumentosFirmados')->get($aux_nombre_documento_firmar.$prefijofinal.".".$extension); // obtenemos el documento firmado
                        Storage::disk($discoDocumento)->put(str_replace("", "",$nombre_documento_firmar), $documento_firmado); 
                    
                        // buscamos el documento en el disco destino
                        $exists_destino = Storage::disk($discoDocumento)->exists($nombre_documento_firmar); 
                        if($exists_destino){
                            return ['error'=>true,'mensaje'=>'Firmados'];
                        }else{
                            return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
                        }

                    }else{
                        return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
                    }

            }else{
                Log::error("FirmaDocumentoController => firmarDocumentoInvisible => Mensaje: ".$pdfSigner->getError());
                if($pdfSigner->getError()=='Frase de contraseña incorrecta'){
                    return ['error'=>false,'tipo'=>'CI','mensaje'=>'Contraseña Incorrecta'];
                }
                return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
            }          

        }catch(\Throwable $th){
            Log::error("firmarDocumeFirmaDocumentoControllerntoInvisible => catch firmarDocumentoInvisible => Mensaje: ".$th->getMessage()." linea ".$th->getLine());
            return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];

        }



    }



    // función que realiza el proceso de firma electronica de un solo documento
    public function firmarDocumento($nombre_documento_firmar, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, $discoDocumento,$razon,$localizacion,$nombre_firma){

        try{
         
            $ruta_base = base_path();
            $ruta_base =str_replace("\\","/",$ruta_base);

            $pdfSigner =  new BSrE_PDF_Signer_Cli();
            $pdfSigner->addmultipleSign();
            $pdfSigner->setDocument($ruta_base.'/storage/app/documentosFirmar/'.$nombre_documento_firmar);
            $pdfSigner->setLibraryPath($ruta_base.'/app/JSignPDF/library');
            $pdfSigner->readCertificateFromFile(
                $ruta_base.'/storage/app/documentosFirmar/'.$nombre_archivo_certificado,
                $clave_certificado
            );
            $pdfSigner->setCertificationLevel(2);
            $pdfSigner->setSuffixFileName($prefijofinal);
           
            $pdfSigner->setDirectory('/storage/app/documentosFirmar', false);
    
            $archivo= $ruta_base.'/storage/app/documentosFirmar/'.$nombre_archivo_certificado;
            

            $codigoQR =base64_encode(QrCode::format('png')->size(30)->backgroundColor(255,255,255, 0.5)->generate('FIRMADO POR: '.$nombre_firma."\n". 'RAZON: '.$razon."\n". 'LOCALIZACION: '.$localizacion."\n". "FECHA " .date('Y-m-d H:i:s')."\n". "VALIDAR CON: www.firmadigital.gob.ec"));

            $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 
            $dataURI= "data:image/png;base64,".$codigoQR;
            $dataPieces = explode(',',$dataURI);
            $encodedImg = $dataPieces[1]; $decodedImg = base64_decode($encodedImg);  
    
            // VERIFICAMOS SI LA IMAGEN FUE DECODIFICADA
            if( $decodedImg!==false ) {  
                if( file_put_contents($TEMPIMGLOC,$decodedImg)!==false ) { 
                    //MANDAMOS A IMPRIMIR LA IMAGEN EN LA RESPECTIVA POSICION
                    $imagen=$TEMPIMGLOC;
                }
                
            } 

            if($razon!=null){
                $pdfSigner->setReason($razon);
            }
            if($localizacion!=null){
                $pdfSigner->setLocation($localizacion);
            }

           
            $pdfSigner->setAppearance(
           
                $position = array(
               
                    'llx' => '10', //inferior izquierda X
                    'lly' => '40', //inferior izquierda Y
                    'urx' => '50', //superior derecha X 
                    'ury' => '90'  //superior derecha Y

                ),

                $page = 1000, // para que lo ponga al final
                // $spesimen = $ruta_base."/public/DocumentosManuales/tempimg.png", // imagen de fondo
                $spesimen = null, // imagen de fondo
                $bgscale = -1, // estala de imagen de fondo
                $fontsize = 8, // tamaño de fuente
                $text = false, // mostrar el sello de la firma
                $content_text = '',

               
            );

          
            if($pdfSigner->sign()){

                //proceso pasar documento firmado al disco origen
                
                    $aux_nombre_documento_firmar = pathinfo($nombre_documento_firmar, PATHINFO_FILENAME);
                    $extension = pathinfo($nombre_documento_firmar, PATHINFO_EXTENSION);
                    
                    $exists = Storage::disk('disksDocumentosFirmados')->exists($aux_nombre_documento_firmar.$prefijofinal.".".$extension); //buscamos el documento firmado
                    if($exists){                
                        //pasamos el documento firmado
                        $documento_firmado = Storage::disk('disksDocumentosFirmados')->get($aux_nombre_documento_firmar.$prefijofinal.".".$extension); // obtenemos el documento firmado
                        Storage::disk($discoDocumento)->put(str_replace("", "",$nombre_documento_firmar), $documento_firmado); 
                    
                        // buscamos el documento en el disco destino
                        $exists_destino = Storage::disk($discoDocumento)->exists($nombre_documento_firmar); 
                        if($exists_destino){                            
                            return ['error'=>true,'mensaje'=>'Firmados','nombrefirma'=>$nombre_firma];
                        }else{
                            return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
                        }

                    }else{
                        return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
                    }

            }else{
                Log::error("FirmaDocumentoController => firmarDocumento => Mensaje: ".$pdfSigner->getError());
                if($pdfSigner->getError()=='Frase de contraseña incorrecta'){
                    return ['error'=>false,'tipo'=>'CI','mensaje'=>'Contraseña Incorrecta'];
                }
                return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];
            }          

        }catch(\Throwable $th){
            Log::error("FirmaDocumentoController => catch firmarDocumento => Mensaje: ".$th->getMessage()." linea ".$th->getLine());
            return ['error'=>false,'tipo'=>'NA','mensaje'=>'No se pudo firmar algunos documentos'];

        }


    }

    public function visualizardoc($documentName){
       try {
            $disco="public";
            $exist=\Storage::disk($disco)->exists($documentName);
            if($exist){
                $doc=\Storage::disk($disco)->get($documentName);
                 return view("vistaPreviaDocumento")->with([
                    "documentName"=>$doc,
                    "documentEncode"=>base64_encode($doc)
                ]);   
            }           
        } catch (\Throwable $th) {
            Log::error("FirmaDocumentoController => catch firmarDocumento => Mensaje: ".$th->getMessage()." linea ".$th->getLine());
            abort("404");
        }

    }

    public function descargarDoc($documentName){
        try {
           
            $disco="public";
            $exist=\Storage::disk($disco)->exists($documentName);
            if($exist){
                return \Storage::disk($disco)->download($documentName);
            }           
         } catch (\Throwable $th) {
             abort("404");
         }

    }

    public function generate_string($strength = 8) {

        $input = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        $input_length = strlen($input);
        $random_string = '';
        for($i = 0; $i < $strength; $i++) {
            $random_character = $input[mt_rand(0, $input_length - 1)];
            $random_string .= $random_character;
        }
    
        return $random_string;
    }

    //ELIMINAR VARIOS O UN DOCUEMTO SELECCIONADO EN EL CHECK
    public function eliminarDocumentos(Request $request){
        // dd($request->all());
        $transaction=DB::transaction(function() use ($request){
            try {        
                $documento=$request->iddocumentos;
                if(sizeof($documento)==0){
                    return response()->json([
                        "error" => true,
                        "mensaje" => "Debe seleccionar al menos un documento",
                    ]);
                }
                $correcto=0;
                foreach($documento as $iddoc){
                    $eliminarDoc= FirmarDocumentosModel::find($iddoc);                
                    $exists = Storage::disk('public')->exists($eliminarDoc->documento);
                    if($exists){
                        Storage::disk('public')->delete($eliminarDoc->documento);
                        Storage::disk('public')->delete($eliminarDoc->respaldo);
                        $eliminarDoc->delete();
                        $correcto=$correcto+1;
                    }
                }
                if($correcto>0){
                    return response()->json([
                        "error" => false,
                        "mensaje" => "Documento(s) borrado(s) exitosamente",
                    ]);
                }else{
                    return response()->json([
                        "error" => true,
                        "mensaje" => "No se pudo eliminar la informacion",
                    ]);
                }


                
            } catch (\Throwable $e) {
                DB::rollback();
                Log::error(__CLASS__." => ".__FUNCTION__." => Mensaje =>".$e->getMessage());
                return response()->json([
                    "error" => true,
                    "mensaje" => "Ocurrio un error",
                ]);
            }
        });
        return ($transaction);
    }


}
