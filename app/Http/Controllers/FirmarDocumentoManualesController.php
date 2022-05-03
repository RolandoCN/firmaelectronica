<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TipoDocumentosManualesModel;
use App\DocumentosManualesModel;
use App\ParametrosGeneralesModel;
use App\FirmaElectronicaModel;
use App\td_us001_tipofpModel;
use App\BSrE_PDF_Signer_Cli;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Log;

class FirmarDocumentoManualesController extends Controller
{

    public function index(){

        try{        
           
            $departamento_logueado=departamentoLogueado(); //departamento logueado
            $listaDoc = DocumentosManualesModel::with('tipodocumentomanual','usercreate','userdelete')
                ->whereHas('tipodocumentomanual', function($querty) use ($departamento_logueado){
                    $querty->where('iddepartamento', $departamento_logueado['iddepartamento']);
                })
                ->whereNotNull('codigo_rastreo')
                ->where('estado_eliminar',0)
                ->where('firmado',0)
                ->get();
        
            return view('gestionDocumentos.firmarDocumentos.vistaPrincipal',[
                'listaDoc'=> $listaDoc,
                'departamento'=> $departamento_logueado['departamento']
            ]);
        } catch (\Throwable $th) {
            Log::error("Error get Request Id ".$th->getMessage());
            abort("500");
        }

    }


    // función para obtener todos los documentos
    public function obtenerDocumentos($estado_firma){
        try{

            $condicion = "=";
            $firmado = 0;

            if($estado_firma=="T"){
                $condicion="!="; $firmado=2; // para que traiga todos
            }else if($estado_firma=="F"){
                $firmado=1; // para que traiga los firmados
            }else if($estado_firma != "P"){ // si no viene "P" quiere decir que se cambio el código del la página
                return response()->json([
                    "error"=>true,
                    "mesaje"=>"No se pudo obtener los documentos"
                ]);
            }

            $departamento_logueado=departamentoLogueado(); //departamento logueado
            $listaDoc = DocumentosManualesModel::with('tipodocumentomanual','usercreate','userdelete')
                ->whereHas('tipodocumentomanual', function($querty) use ($departamento_logueado){
                    $querty->where('iddepartamento', $departamento_logueado['iddepartamento']);
                })
                ->whereNotNull('codigo_rastreo')
                ->where('estado_eliminar',0)
                ->where('firmado',"$condicion", $firmado)
                ->get();
                
            return response()->json([
                "error"=>false,
                "lista_documentos"=>$listaDoc
            ]);
            
        }catch(\Throwable $th){
            Log::error("FirmarDocumentoManualesController => obtenerDocumentos => Mensaje: ".$th->getMessage());
            return response()->json([
                "error"=>true,
                "mensaje"=>"Error al obtener los documentos"
            ]);
        }
    }

    // función para verificar la configuración de la firma
    public function verificarConfigFirmado(){

        try{

            $mensajeError = "";

            //verificamos que sea el jefe del departamento
                $departamentoLogueado = departamentoLogueado();
                if($this->verificarJefeDepartamento($departamentoLogueado['iddepartamento'])==false){ // solo puede firmar el jefe del departamento que se envia el trámite
                    $mensajeError = "Usted no es el jefe del departamento"; goto RETORNARERROR;
                }

            // ------------- para saber que tieme configurado el usuario

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
                        $fecha_actual = date('Y-m-d H:m:s');
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
            Log::error("FirmarDocumentoManualesController => verificarConfigFirmado => Mensaje:".$th->getMessage());
            return response()->json([
                "error" => true,
                "mensaje" => "No se pudo verificar la configuración de la firma electrónica",
                "status" => "error"
            ]);
        }


    }


    // función para tratar la información de los documentos a firmar
    public function procesarDocumentosFirmar(Request $request){

        try{

            $list_nombre_documento_firmar = []; // lista de los nombres de los documentos que se van a firmar
            $nombre_archivo_certificado = ""; // nombre del archivo certificado (.p12)
            $clave_certificado = ""; // la contraseña del archivo certificado (.p12)
            $prefijofinal = "_firmado"; // prefijo para el documento firmado (vacio para que se sobre escriba el documento)
            $mensajeError = ""; // para almacenar el error
            $firma_configurada = false; // para verificar si tiene archivo de certificado
            $num_doc_firmar = 0; // para almecenar el numero de documentos a firmar
            $nun_doc_firmados = 0; // para contar cuando documento se firmaron
            $nun_doc_no_firmados = 0; // para contar cuando documento no se firmaron


            // ----------------- verificamos que se seleccione documentos para firmar


                if(isset($request->list_documento_manuales)){
                    if(is_null($request->list_documento_manuales)){
                        $mensajeError = "Tiene que seleccionar el o los documentos a firmar"; goto RETORNARERROR;
                    }else if(sizeof($request->list_documento_manuales)==0){
                        $mensajeError = "Tiene que seleccionar el o los documentos a firmar"; goto RETORNARERROR;
                    }
                }else{
                    $mensajeError = "Tiene que seleccionar el o los documentos a firmar"; goto RETORNARERROR;
                }


            // ----------------- obtenemos los datos firma configurada --------------------------------------

                $idus001 = auth()->user()->idus001;
                $firma_electronica_conf = FirmaElectronicaModel::where('idus001', $idus001)->first();

                if(!is_null($firma_electronica_conf)){
                    if(!is_null($firma_electronica_conf->archivo_certificado)){

                        //obtenemos los dias validos del certificado cardago
                        $fecha_actual = date('Y-m-d H:m:s');
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
                        goto RETORNARERROR;
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
                            $mensajeError="El archivo del certificado debe ser formato .p12"; goto RETORNARERROR; 
                        }
                        $nombre_archivo_certificado = $archivo_certificado->getClientOriginalName();
                        $nombre_archivo_certificado = "certif_".md5($nombre_archivo_certificado.$idus001).".$extension";
                        \Storage::disk('disksDocumentosFirmados')->put($nombre_archivo_certificado,  \File::get($archivo_certificado));
                    }else{
                        $mensajeError = "Archivo certificado no enviado"; goto RETORNARERROR;
                    }                    
                }


            // ----------------- obtenemos todos los documentos a firmar ------------------------------------

                foreach ($request->list_documento_manuales as $ld => $iddocumento_manuales){

                    $num_doc_firmar++;

                    //obtenemos la informacion del documento afirmar
                        $iddocumento_manuales = decrypt($iddocumento_manuales);
                        $documento_manuales = DocumentosManualesModel::where('iddocumento_manuales', $iddocumento_manuales)->first(); 
                        if(is_null($documento_manuales)){ $nun_doc_no_firmados++; continue;}

                    //almacenamos el nombre fisico del documento a firmar
                        $nombre_documento_firmar = $documento_manuales->ruta;
                        array_push($list_nombre_documento_firmar, $nombre_documento_firmar); // guardamos el nombre de los documentos en la lista de documentos firmados
                    
                    //pasamos el documento a la carpeta para firmar
                        $documentoListo = Storage::disk('diskFormatoValidacionDocumento')->get($nombre_documento_firmar); // obtenemos el documento del servidor sftp
                        Storage::disk('disksDocumentosFirmados')->put(str_replace("", "",$nombre_documento_firmar), $documentoListo); // guardamos locammente el documeto a firmar

                    //llamamos a la funcion para firmar el documento
                        $status_firma = $this->firmarDocumento($nombre_documento_firmar, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, "diskFormatoValidacionDocumento");

                    if($status_firma==true){
                        $nun_doc_firmados++;
                        $documento_manuales->firmado=1;
                        $documento_manuales->save();
                    }else{
                        $nun_doc_no_firmados++;
                    }

                }
            
            
            
            // ------------------ retorno exitoso -----------------------

                $color_status = "success";
                if($nun_doc_no_firmados > 0 && $nun_doc_no_firmados < $num_doc_firmar){ $color_status = "info"; } // y uno que otro documento no firmado
                if($nun_doc_no_firmados == $num_doc_firmar){ $color_status = "error"; } // no se pudo firmar ningun documento

                $this->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);

                return response()->json([
                    "error" => false,
                    "resultado" =>[
                        "mensaje" => "Total documento enviados: $num_doc_firmar <br> Documentos firmados: $nun_doc_firmados <br> Documentos no firmados: $nun_doc_no_firmados",
                        "status" => $color_status
                    ]
                ]);
                


            // ------------------ retornar error -------------------------

                RETORNARERROR:
                Log::error($mensajeError);
                $this->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);
                return response()->json([
                    "error" => true,
                    "resultado" =>[
                        "mensaje" => $mensajeError,
                        "status" => "error"
                    ]
                ]);  
            
            // -------------------------------------------------------------

        }catch(\Throwable $th){
            Log::error("FirmarDocumentoManualesController => procesarDocumentosFirmar => Mensaje: ".$th->getMessage());
            $this->borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal);
            return response()->json([
                "error" => true,
                "resultado" =>[
                    "mensaje" => "No se pudo firmar los documentos",
                    "status" => "error"
                ]
            ]);   
        }



    }


    // función que realiza el proceso de firma electronica de un solo documento
    public function firmarDocumento($nombre_documento_firmar, $nombre_archivo_certificado, $clave_certificado, $prefijofinal, $discoDocumento){

        try{
            
            $ruta_base = base_path();
            $ruta_base =str_replace("\\","/",$ruta_base);

            $pdfSigner =  new BSrE_PDF_Signer_Cli();
            $pdfSigner->setDocument($ruta_base.'/storage/app/documentosFirmar/'.$nombre_documento_firmar);
            $pdfSigner->setLibraryPath($ruta_base.'/app/JSignPDF/library');
            $pdfSigner->readCertificateFromFile(
                $ruta_base.'/storage/app/documentosFirmar/'.$nombre_archivo_certificado,
                $clave_certificado
            );
            $pdfSigner->setCertificationLevel(2);
            $pdfSigner->setSuffixFileName($prefijofinal);
            // $pdfSigner->setLocation('SistemaDocumental');
            $pdfSigner->setDirectory('/storage/app/documentosFirmar', false);

            $pdfSigner->setAppearance(
                $position = array(
                    'llx' => '35', //inferior izquierda X
                    'lly' => '15', //inferior izquierda Y
                    'urx' => '110', //superior derecha X 
                    'ury' => '75'  //superior derecha Y
                ),
                $page = 1000, // para que lo ponga al final
                $spesimen = $ruta_base."/public/images/iconopdf.png", // imagen de fondo
                $bgscale = -1, // estala de imagen de fondo
                $fontsize = 8, // tamaño de fuente
                $text = true, // mostrar el sello de la firma
                $content_text = 'Documento Firmado Electronicamente'
                // $content_text = 'Firmado digitalmente por ${signer}  Fecha: ${timestamp}' // contenido del sello de la firma
            );

            if($pdfSigner->sign()){
                //proceso pasar documento firmado al disco origen
                
                $aux_nombre_documento_firmar = pathinfo($nombre_documento_firmar, PATHINFO_FILENAME);
                $extension = pathinfo($nombre_documento_firmar, PATHINFO_EXTENSION);
                
                $exists = Storage::disk('disksDocumentosFirmados')->exists($aux_nombre_documento_firmar.$prefijofinal.".".$extension); //buscamos el documento firmado
                if($exists){                
                    //pasamos el documento firmado
                    $documento_firmado = Storage::disk('disksDocumentosFirmados')->get($aux_nombre_documento_firmar.$prefijofinal.".".$extension); // obtenemos el documento firmado
                    Storage::disk($discoDocumento)->put(str_replace("", "",$nombre_documento_firmar), $documento_firmado); // remplazamos el documento firmado en el disco origen
                    return true;
                }else{
                    return false;
                }

            }else{
                Log::error("FirmarDocumentoManualesController => firmarDocumento => Mensaje: ".$pdfSigner->getError());
                return false;
            }          

        }catch(\Throwable $th) {
            Log::error("FirmarDocumentoManualesController => firmarDocumento => Mensaje: ".$th->getMessage());
            return false;
        }



    }


     //funcion para borrar los archivos creados temporalmente
     public function borrarArchivosTemporales($nombre_archivo_certificado, $list_nombre_documento_firmar, $prefijofinal){
        // return;
        // ---------- borramos el archivo certificado -------------------

            $exists1 = \Storage::disk('disksDocumentosFirmados')->exists($nombre_archivo_certificado);
            if($exists1){
                \Storage::disk('disksDocumentosFirmados')->delete($nombre_archivo_certificado);         
            }

        foreach ($list_nombre_documento_firmar as $ndf => $nombre_documento_firmar){

            // ---------- borramos el archivo sin firmar --------------------

                $exists2 =  \Storage::disk('disksDocumentosFirmados')->exists($nombre_documento_firmar); 
                if($exists2){
                    \Storage::disk('disksDocumentosFirmados')->delete($nombre_documento_firmar); 
                }

            // ---------- borramos el archivo firmado -----------------------

                $aux_nombre_documento_firmar = pathinfo($nombre_documento_firmar, PATHINFO_FILENAME);
                $extension = pathinfo($nombre_documento_firmar, PATHINFO_EXTENSION);
                $exists3 = \Storage::disk('disksDocumentosFirmados')->exists($aux_nombre_documento_firmar.$prefijofinal.".".$extension);
                if($exists3){
                    \Storage::disk('disksDocumentosFirmados')->delete($aux_nombre_documento_firmar.$prefijofinal.".".$extension);
                }
                
            // --------------------------------------------------------------  
                      
        }


    }

    //funcion para verificar si el el jefe del departamento
    public function verificarJefeDepartamento($iddepartamento){

        //primero si no esta logueado
        if(Auth::guest()){ return false; }

        if($iddepartamento==0){ return false; }
        $idus001 = auth()->user()->idus001; // id del usuario logueado

        // buscamos el jefe de ese departamento
        $jefeDepLogueado = td_us001_tipofpModel::with('us001', 'departamento') // obtenemos el jefe de ese departamento
            ->where('iddepartamento',$iddepartamento)
            ->where('jefe_departamento','1')
            ->first();

        if(is_null($jefeDepLogueado)){ return false;}
        if($jefeDepLogueado->us001->idus001!=$idus001){return false;}

        //todo esta bien (el usuario es el jefe del departamento)
        return true;

    }


}
