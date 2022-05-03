<?php

namespace App\Http\Controllers\FirmaDocumentos;
use App\FirmarDocumentos\FirmarDocumentosModel;
use Storage;
use Log;
use QrCode;
use App\FirmarDocumentos\ParametroHojaModel;


class EdicionPdfController extends \setasign\Fpdi\Fpdi{


    protected $B = 0;
    protected $I = 0;
    protected $U = 0;
    protected $HREF = '';

    function WriteHTML($html){
        // HTML parser
        $html = str_replace("\n",' ',$html);
        $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
        foreach($a as $i=>$e)
        {
            if($i%2==0)
            {
                // Text
                if($this->HREF)
                    $this->PutLink($this->HREF,$e);
                else
                    $this->Write(5,$e);
            }
            else
            {
                // Tag
                if($e[0]=='/')
                    $this->CloseTag(strtoupper(substr($e,1)));
                else
                {
                    // Extract attributes
                    $a2 = explode(' ',$e);
                    $tag = strtoupper(array_shift($a2));
                    $attr = array();
                    foreach($a2 as $v)
                    {
                        if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                            $attr[strtoupper($a3[1])] = $a3[2];
                    }
                    $this->OpenTag($tag,$attr);
                }
            }
        }
    }

    function OpenTag($tag, $attr){
        // Opening tag
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,true);
        if($tag=='A')
            $this->HREF = $attr['HREF'];
        if($tag=='BR')
            $this->Ln(5);
    }

    function CloseTag($tag){
        // Closing tag
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,false);
        if($tag=='A')
            $this->HREF = '';
    }

    function SetStyle($tag, $enable){
        // Modify style and select corresponding font
        $this->$tag += ($enable ? 1 : -1);
        $style = '';
        foreach(array('B', 'I', 'U') as $s)
        {
            if($this->$s>0)
                $style .= $s;
        }
        $this->SetFont('',$style);
    }

    function PutLink($URL, $txt){
        // Put a hyperlink
        $this->SetTextColor(0,0,255);
        $this->SetStyle('U',true);
        $this->Write(5,$txt,$URL);
        $this->SetStyle('U',false);
        $this->SetTextColor(0);
    }


    function crear_edicion($archivo,$nombre,$razon,$localizacion){

        try{
            //DATOS HOJAS
            $datosHojas=ParametroHojaModel::first();
            // PASAMOS EL ARCHIVO DE LA CARPETA PUBLIC A DOCMANUALES
            
            $documentoListo = Storage::disk('public')->get($archivo); // obtenemos el documento 
            Storage::disk('diskDocumentosManuales')->put(str_replace("", "",$archivo), $documentoListo);

            // CREAMOS UNA VARIABLE PARA ACCEDER AL ARCHIVO
            $srcfile=public_path('DocumentosManuales/'.$archivo);
            
            //OBTENEMOS EL NOMBRE DEL ARCHIVO
            $file=basename($srcfile, ".pdf");

           
            //CREAMOS UNA VARIABLE PARA EL NUEVO ARCHIVO CREADO EN CASO DE QUE AL ARCHIVO A EDITAR SEA SUPERIOR A LA VERSION 1.4
            // $srcfile_new=storage_path('/app/public/'.$archivo);
            $srcfile_new=public_path('DocumentosManuales/'.$file."_".".pdf");

            //si el archivo es mayor a 1.5 se ejecuta ghostscript y el archivo se llamara igual al original doc
            $borrar_new=$file."_.pdf";
            
            // variable o nombre del documeto validado (igual al nombre original del documento)
            $srcfile_edit=$file.".pdf";

            //variable del noimbre del archivo original ,(se borrara el archivo en caso de ocurrir un error con ghostscript)
            $srcfile_borrar=$file.".pdf";

        
            // COMPROBAMOS QUE VERSION ES EL ARCHIVO
            $filepdf = fopen($srcfile,"r");
            if ($filepdf){
            $line_first = fgets($filepdf);
            fclose($filepdf);
            }else{
            //echo "error opening the file.";
            }
            preg_match_all('!\d+!', $line_first, $matches); 
            // GUARDAMOS EL NUMERO DE VERSION DEL ARCHIVO EN UNA VARIABLE
            $pdfversion = implode('.', $matches[0]);

            ///////////////// SI LA VERSION DEL ARCHIVO  PDF ES INFERIOR A 1.7 ENTRARA AQUI PARA VOLVERLO A LA VERSION 1.7 Y PODER CONTINUAR CON EL PROCESO DE EDICIION ///////////////////////////////

            if($pdfversion < "1.7"){

                // SI LA VERSION ES MAYOR A 1.4 LO CONERTIMOS A LA VERSION 1.4 CON GHOSTSCRIPT, AQUI SE DEBE INDICAR LA RUTA DE DONDE ESTA INSTALADO GHOSTSCRIPT, PDFWRITE PARA ESCRIBIR EN EL DOC, EL NIVEL DE COMPATIBILIDAD (1.7), LOS ARCHIVOS TANTO EL NUEVO A CREAR COMO EL DEL CUAL SE VA A REALIZAR LA CONVERSION

                if(PHP_OS=='WINNT'){ //sistema operativo windows
                    exec('"C:\Archivos de Programa\gs\gs9.56.1\bin\gswin64.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');   
                }else{//linux
                    $exec('gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');
                }

                $doc=$srcfile_new;
            }else{
                $doc=$srcfile;
            }

            
            //INSTANCIAMOS LA CLASE PDF PARA TERMINAR DE CREAR EL ARCHIVO
            $pdf = new EdicionPdfController();
            
            //CONTAMOS EL NUMERO DE PAGINAS DEL ARCHIVO
            $pageCount = $pdf->setSourceFile($doc);
            
            $dato_persona=explode(" ", $nombre);
            $tamanio_dato=sizeof($dato_persona);

            if($tamanio_dato<3){
                $apellidos='';
            }

            if($tamanio_dato==3){
                $apellidos=$dato_persona[2];
            }

            if($tamanio_dato==4){
                $apellidos=$dato_persona[2]." ".$dato_persona[3];

            }
    
            if($tamanio_dato==5){
                $apellidos=$dato_persona[2]." ".$dato_persona[3]." ".$dato_persona[4];
            }

            if($tamanio_dato>=6){
                $apellidos=$dato_persona[2]." ".$dato_persona[3]." ".$dato_persona[4];
            }
           
            $codigoQR =base64_encode(QrCode::format('png')->size(50)->backgroundColor(255,255,255, 0.5)->generate('FIRMADO POR: '.$nombre."\n". 'RAZON: '.$razon."\n". 'LOCALIZACION: '.$localizacion."\n". "FECHA " .date('Y-m-d H:i:s')."\n". "VALIDAR CON: www.firmadigital.gob.ec"));

            $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 
            $dataURI= "data:image/png;base64,".$codigoQR;
            $dataPieces = explode(',',$dataURI);
            $encodedImg = $dataPieces[1]; $decodedImg = base64_decode($encodedImg);  
    
            // VERIFICAMOS SI LA IMAGEN FUE DECODIFICADA
            if( $decodedImg!==false ) {  
                if( file_put_contents($TEMPIMGLOC,$decodedImg)!==false ) { 
                    //MANDAMOS A IMPRIMIR LA IMAGEN EN LA RESPECTIVA POSICION                    
                }
                
            } 
            
            $formato_hoja=$datosHojas->formato;
            $orientacion_hoja=$datosHojas->orientacion;
            $valorX=$datosHojas->coordenada_x;
            $valorY=$datosHojas->coordenada_y;

            if($razon=="" && $localizacion==""){
                $valorX=$valorX+1;
                $valorY=$valorY+1;
                $valor_texo_firmado=13;

            }else{
               
                $valorX=$valorX;
                $valorY=$valorY;
                $valor_texo_firmado=14;
                
            }

            if($datosHojas->hoja_firma=="P"){
                $pagina_selecc=1;
            }elseif($datosHojas->hoja_firma=="U"){
                $pagina_selecc=$pageCount;
            }else{
                $pagina_selecc=$datosHojas->hoja_firma;
                if($pagina_selecc>$pageCount){
                    return ['error'=>true,'mensaje'=>'El número de página ingresado, es mayor a la cantidad de páginas del documento'];
                }

                if($pagina_selecc<=0){
                    return ['error'=>true,'mensaje'=>'Ingrese un número de página mayor de cero'];
                }

            }
        
            // RECORREMOS CADA UNA DE LAS PAGINAS
            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {

                if($formato_hoja=="A4" && $orientacion_hoja=="H"){$pdf->addPage('L','A4');}
                if($formato_hoja=="A4" && $orientacion_hoja=="V"){$pdf->addPage();}
    
                if($formato_hoja=="A3" && $orientacion_hoja=="H"){$pdf->addPage('L','A3');}
                if($formato_hoja=="A3" && $orientacion_hoja=="V"){$pdf->addPage('A3');}
    
                if($formato_hoja=="A5" && $orientacion_hoja=="H"){$pdf->addPage('L','A5');}
                if($formato_hoja=="A5" && $orientacion_hoja=="V"){$pdf->addPage('A5');}

                
                $templateId = $pdf->importPage($pageNo);

                //APLICAMOS EL ESTILO SOLO A LA SELECCIONADA
                if($pageNo==$pagina_selecc){

                    $pdf->SetFont('courier','',4);

                    $pdf->Image($TEMPIMGLOC,$valorX,$valorY);

                    $pdf->Text($valorX+$valor_texo_firmado, $valorY+4,utf8_decode("Firmado electrónicamente por:")); 
                    $pdf->Ln(4); 
                    $pdf->SetFont('courier','B',7);                        
                    $pdf->Text($valorX+$valor_texo_firmado, $valorY+7, $dato_persona[0]." ".$dato_persona[1]); 
                    $pdf->Text($valorX+$valor_texo_firmado, $valorY+10, $apellidos); 
                    
                }
                                        
                $pdf->useTemplate($templateId, ['adjustPageSize' => false]);  
                
            }

            $pdf->Output('F', 'DocumentosManuales/'.$srcfile_edit);

            $documentoListo = Storage::disk('diskDocumentosManuales')->get($archivo); // obtenemos el documento 
            Storage::disk('public')->put(str_replace("", "",$archivo), $documentoListo);


            if(file_exists('DocumentosManuales/'.$borrar_new)){
              Storage::disk('diskDocumentosManuales')->delete($borrar_new);    
            }

            $exists_destino = Storage::disk('public')->exists($srcfile_edit); 
            if($exists_destino){
                Storage::disk('diskDocumentosManuales')->delete($archivo); // elimnamos el documento 
                return true;
            }else{
                return false;
            }

        }catch(\Throwable $th){
            \Log::error("EdicionPdfController => crear_edicion => Mensaje: ".$th->getMessage()." linea ".$th->getLine());
            return false;    
        }

    }

    function simular_edicion($archivo,$nombre,$razon,$localizacion, $datos){

        try{
           
            $formato_hoja=$datos['formato'];
            $orientacion_hoja=$datos['orientacion'];
            $coordenada_x=$datos['x'];
            $coordenada_y=$datos['y'];
            $pagina=$datos['pagina'];

            // PASAMOS EL ARCHIVO DE LA CARPETA PUBLIC A DOCUMENTOS MANUALES
            
            $documentoListo = Storage::disk('public')->get($archivo); // obtenemos el documento 
            Storage::disk('diskDocumentosManuales')->put(str_replace("", "",$archivo), $documentoListo);

            // CREAMOS UNA VARIABLE PARA ACCEDER AL ARCHIVO
            $srcfile=public_path('DocumentosManuales/'.$archivo);
            
            //OBTENEMOS EL NOMBRE DEL ARCHIVO
            $file=basename($srcfile, ".pdf");

           
            //CREAMOS UNA VARIABLE PARA EL NUEVO ARCHIVO CREADO EN CASO DE QUE AL ARCHIVO A EDITAR SEA SUPERIOR A LA VERSION 1.4
            // $srcfile_new=storage_path('/app/public/'.$archivo);
            $srcfile_new=public_path('DocumentosManuales/'.$file."_".".pdf");

            //si el archivo es mayor a 1.5 se ejecuta ghostscript y el archivo se llamara igual al original doc
            $borrar_new=$file."_.pdf";
            
            // variable o nombre del documeto validado (igual al nombre original del documento)
            $srcfile_edit=$file.".pdf";

            //variable del noimbre del archivo original ,(se borrara el archivo en caso de ocurrir un error con ghostscript)
            $srcfile_borrar=$file.".pdf";

        
            // COMPROBAMOS QUE VERSION ES EL ARCHIVO
            $filepdf = fopen($srcfile,"r");
            if ($filepdf){
                $line_first = fgets($filepdf);
                fclose($filepdf);
            }
            preg_match_all('!\d+!', $line_first, $matches); 
            // GUARDAMOS EL NUMERO DE VERSION DEL ARCHIVO EN UNA VARIABLE
            $pdfversion = implode('.', $matches[0]);

            ///////////////// SI LA VERSION DEL ARCHIVO  PDF ES INFERIOR A 1.7 ENTRARA AQUI PARA VOLVERLO A LA VERSION 1.7 Y PODER CONTINUAR CON EL PROCESO DE EDICIION ///////////////////////////////

            if($pdfversion < "1.7"){

                // SI LA VERSION ES MENOR A 1.7 LO CONERTIMOS A LA VERSION 1.7 CON GHOSTSCRIPT, AQUI SE DEBE INDICAR LA RUTA DE DONDE ESTA INSTALADO GHOSTSCRIPT, PDFWRITE PARA ESCRIBIR EN EL DOC, EL NIVEL DE COMPATIBILIDAD (1.4), LOS ARCHIVOS TANTO EL NUEVO A CREAR COMO EL DEL CUAL SE VA A REALIZAR LA CONVERSION

                if(PHP_OS=='WINNT'){ //sistema operativo windows
                    exec('"C:\Archivos de Programa\gs\gs9.56.1\bin\gswin64.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');   
                }else{//linux
                    $exec('gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');
                }

                $doc=$srcfile_new;
            }else{
                $doc=$srcfile;
            }

            
            //INSTANCIAMOS LA CLASE PDF PARA TERMINAR DE CREAR EL ARCHIVO
            $pdf = new EdicionPdfController();
            
            //CONTAMOS EL NUMERO DE PAGINAS DEL ARCHIVO
            $pageCount = $pdf->setSourceFile($doc);          
            
            $dato_persona=explode(" ", $nombre);
            $tamanio_dato=sizeof($dato_persona);
            // dd($dato_persona[2]);

            if($tamanio_dato<3){
                $apellidos='';
            }

            if($tamanio_dato==3){
                $apellidos=$dato_persona[2];
            }
    
            if($tamanio_dato==4){
                $apellidos=$dato_persona[2]." ".$dato_persona[3];

            }
    
            if($tamanio_dato==5){
                $apellidos=$dato_persona[2]." ".$dato_persona[3]." ".$dato_persona[4];
            }

            if($tamanio_dato>=6){
                $apellidos=$dato_persona[2]." ".$dato_persona[3] ." ".$dato_persona[4];
            }
            // $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 
            $nombre="DOCUMENTO PDOCE TEST ARCHIVO";

            $codigoQR =base64_encode(QrCode::format('png')->size(50)->backgroundColor(255,255,255, 0.5)->generate('FIRMADO POR: '.$nombre."\n". 'RAZON: '.$razon."\n". 'LOCALIZACION: '.$localizacion."\n". "FECHA " .date('Y-m-d H:i:s')."\n". "VALIDAR CON: www.firmadigital.gob.ec"));

            $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 
            $dataURI= "data:image/png;base64,".$codigoQR;
            $dataPieces = explode(',',$dataURI);
            $encodedImg = $dataPieces[1]; $decodedImg = base64_decode($encodedImg);  
    
            // VERIFICAMOS SI LA IMAGEN FUE DECODIFICADA
            if( $decodedImg!==false ) {  
                if( file_put_contents($TEMPIMGLOC,$decodedImg)!==false ) { 
                    //MANDAMOS A IMPRIMIR LA IMAGEN EN LA RESPECTIVA POSICION                    
                }
                
            } 

            if($razon=="" && $localizacion==""){
                $valorX=$coordenada_x;
                $valorY=$coordenada_y;
            }else{
                $valorX=$coordenada_x;
                $valorY=$coordenada_y;
            }

            if($pagina=="P"){
                $pagina_selecc=1;
            }elseif($pagina=="U"){
                $pagina_selecc=$pageCount;
            }else{
                $pagina_selecc=$datos['num_pag'];
                if($pagina_selecc>$pageCount){
                    return ['error'=>true,'mensaje'=>'El número de página ingresado, es mayor a la cantidad de páginas del documento'];
                }

                if($pagina_selecc<=0){
                    return ['error'=>true,'mensaje'=>'Ingrese un número de página mayor de cero'];
                }

            }
        
            // RECORREMOS CADA UNA DE LAS PAGINAS
            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {

                if($formato_hoja=="A4" && $orientacion_hoja=="H"){$pdf->addPage('L','A4');}
                if($formato_hoja=="A4" && $orientacion_hoja=="V"){$pdf->addPage();}
    
                if($formato_hoja=="A3" && $orientacion_hoja=="H"){$pdf->addPage('L','A3');}
                if($formato_hoja=="A3" && $orientacion_hoja=="V"){$pdf->addPage('A3');}
    
                if($formato_hoja=="A5" && $orientacion_hoja=="H"){$pdf->addPage('L','A5');}
                if($formato_hoja=="A5" && $orientacion_hoja=="V"){$pdf->addPage('A5');}
                
                $templateId = $pdf->importPage($pageNo);

                //APLICAMOS EL ESTILO SOLO A LA SELECCIONADA
                if($pageNo==$pagina_selecc){

                    $pdf->SetFont('courier','',4);   
                    
                    $pdf->Image($TEMPIMGLOC,$valorX,$valorY);

                    $pdf->Text($valorX+14, $valorY+4,utf8_decode("Firmado electrónicamente por:")); 
                    $pdf->Ln(4); 
                    $pdf->SetFont('courier','B',7);                        
                    // $pdf->Text($valorX+14, $valorY+7, $dato_persona[0]." ".$dato_persona[1]); 
                    // $pdf->Text($valorX+14, $valorY+10, $apellidos); 
                    $pdf->Text($valorX+14, $valorY+7, "DOCUMENTO PDOCE"); 
                    $pdf->Text($valorX+14, $valorY+10, "TEST ARCHIVO"); 
                    

                }
                                        
                $pdf->useTemplate($templateId, ['adjustPageSize' => false]);  
                
            }

            $pdf->Output('F', 'DocumentosManuales/'.$srcfile_edit);

            if(file_exists('DocumentosManuales/'.$borrar_new)){
                Storage::disk('diskDocumentosManuales')->delete($borrar_new);    
            }

            // $documentoListo = Storage::disk('diskDocumentosManuales')->get($archivo); // obtenemos el documento 
            // Storage::disk('public')->put(str_replace("", "",$srcfile_edit), $documentoListo);

            $documentoListo = Storage::disk('diskDocumentosManuales')->get($archivo); // obtenemos el documento 
            Storage::disk('public')->put(str_replace("", "",$file."_copia.pdf"), $documentoListo);


            $exists_destino = Storage::disk('public')->exists($srcfile_edit); 
            if($exists_destino){
                Storage::disk('diskDocumentosManuales')->delete($archivo); // elimnamos el documento 
                return ['error'=>false,'mensaje'=>'Correcto'];
               
            }else{
                return ['error'=>true,'mensaje'=>'No se pudo firmar el documento'];
            }

        }catch(\Throwable $th){
            \Log::error("EdicionPdfController => simular_edicion => Mensaje: ".$th->getMessage()." Linea=> ".$th->getLine());
            return ['error'=>true,'mensaje'=>'Ocurrió un error, intentelo más tarde']; 
        }

    }

    function documento_test_color(){
        $archivo="color.pdf";
        // CREAMOS UNA VARIABLE PARA ACCEDER AL ARCHIVO
        $srcfile=storage_path('/app/public/'.$archivo);
    
        $srcfile_edit=$archivo;

        //INSTANCIAMOS LA CLASE PDF PARA TERMINAR DE CREAR EL ARCHIVO
        $pdf = new EdicionPdfController();
        
        //CONTAMOS EL NUMERO DE PAGINAS DEL ARCHIVO
        $pageCount = $pdf->setSourceFile($srcfile);
            
    
        // RECORREMOS CADA UNA DE LAS PAGINAS
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            
            $templateId = $pdf->importPage($pageNo);

            $pdf->AddPage();
            
            // $pdf->addPage('L','A4');
            
            //APLICAMOS EL ESTILO SOLO A LA ULTIMA
            if($pageNo==$pageCount){
            // if($pageNo==12){
                $pdf->SetFont('courier','',4);

                    //======================================
                // Primer bloque - 3 rectángulos      =
                //======================================
                //Rectángulo Azul:
                //Elegir color RGB que llevará Rect al tener el parametro 'F'
                //Rect(x , y, ancho, alto, 'F') F rellena con el color elegido
                //Line(x1, y1, x2, y2) que sale de la esquina superior izquierda
                //cada rectángulo
                //Elegir la posición de la celda para colocar el texto
                //Usamos una celda para poner texto
                $pdf->SetFillColor(80, 150, 200);
                $pdf->Rect(10, 10, 95, 20, 'F');
                $pdf->Line(10, 10, 15, 15);
                $pdf->SetXY(15, 15);
                $pdf->Cell(15, 6, '10, 10', 0 , 1); //Celda
                
                //Amarillo
                $pdf->SetFillColor(255, 215, 0);
                $pdf->Rect(110, 10, 45 , 20, 'F');
                $pdf->Line(110, 10, 115, 15);
                $pdf->SetXY(115, 15);
                $pdf->Cell(15, 6, '110, 10', 0 , 1);
                //Verde
                $pdf->SetFillColor(0, 128, 0);
                $pdf->Rect(160, 10, 40 , 20, 'F');
                $pdf->Line(160, 10, 165, 15);
                $pdf->SetXY(165, 15  );
                $pdf->Cell(15, 6, '160, 10', 0 , 1);
                //========================================
                
                //========================================
                //  Segundo bloque - 1 rectángulo       ==
                //========================================
                //Salmón
                $pdf->SetFillColor(255, 99, 71);
                $pdf->Rect(10, 35, 190, 140, 'F');
                $pdf->Line(10, 35, 15, 40);
                $pdf->SetXY(15, 40);
                $pdf->Cell(15, 6, '10, 35', 0 , 1);
                //========================================
                
                //========================================
                //  Tercer bloque - 2 rectángulos       ==
                //========================================
                //Rosa
                $pdf->SetFillColor(255, 20, 147);
                $pdf->Rect(10, 180, 90, 50, 'F');
                $pdf->Line(10, 180, 15, 185);
                $pdf->SetXY(15, 185);
                $pdf->Cell(15, 6, '10, 180', 0 , 1);
                //Café
                $pdf->SetFillColor(233, 150, 122);
                $pdf->Rect(110, 180, 90, 50, 'F');
                $pdf->Line(110, 180, 115, 185);
                $pdf->SetXY(115, 185);
                $pdf->Cell(15, 6, '110, 180', 0 , 1);
                //========================================
                
                //========================================
                //  Cuarto bloque - 6 rectángulos       ==
                //========================================
                //Verde
                $pdf->SetFillColor(124, 252, 0);
                $pdf->Rect(10, 235, 40, 25, 'F');
                $pdf->Line(10, 235, 15, 240);
                $pdf->SetXY(15, 240);
                $pdf->Cell(15, 6, '10, 235', 0 , 1);
                //Café
                $pdf->SetFillColor(160 ,82, 40);
                $pdf->Rect(60, 235, 40, 25, 'F');
                $pdf->Line(60, 235, 65, 240);
                $pdf->SetXY(65, 240);
                $pdf->Cell(15, 6, '60, 235', 0 , 1);
                //Marrón
                $pdf->SetFillColor(128, 0 ,0);
                $pdf->Rect(10, 265, 40, 25, 'F');
                $pdf->Line(10, 265, 15, 270);
                $pdf->SetXY(15, 270);
                $pdf->Cell(15, 6, '10, 265', 0 , 1);
                //Morado
                $pdf->SetFillColor(153, 50, 204);
                $pdf->Rect(60, 265, 40, 25, 'F');
                $pdf->Line(60, 265, 65, 270);
                $pdf->SetXY(65, 270);
                $pdf->Cell(15, 6, '60, 265', 0 , 1);
                //Azul
                $pdf->SetFillColor(0, 191, 255);
                $pdf->Rect(110, 235, 90, 25, 'F');
                $pdf->Line(110, 235, 115, 240);
                $pdf->SetXY(115, 240);
                $pdf->Cell(15, 6, '110, 235', 0 , 1);
                //Verde
                $pdf->SetFillColor(173, 255, 47);
                $pdf->Rect(110, 265, 90, 25, 'F');
                $pdf->Line(110, 265, 115, 270);
                $pdf->SetXY(115, 270);
                $pdf->Cell(15, 6, '110, 265', 0 , 1);
                
                                
                
            }
                                    
            $pdf->useTemplate($templateId, ['adjustPageSize' => false]);  
            
        }

        $pdf->Output('F', 'DocumentosManuales/'.$srcfile_edit);

        $documentoListo = Storage::disk('diskDocumentosManuales')->get($archivo); // obtenemos el documento 
        Storage::disk('public')->put(str_replace("", "",$srcfile_edit), $documentoListo);

        $exists_destino = Storage::disk('public')->exists($srcfile_edit); 
        if($exists_destino){
            Storage::disk('diskDocumentosManuales')->delete($archivo); // elimnamos el documento 
            return true;
        }else{
            return false;
        }

        
    }
}   
    
        


      

    

// function crear_edicion($archivo,$nombre,$razon,$localizacion){

//     try{
//         //DATOS HOJAS
//         $datosHojas=ParametroHojaModel::first();
//         // dd($datosHojas);
//         // CREAMOS UNA VARIABLE PARA ACCEDER AL ARCHIVO
//         $srcfile=storage_path('/app/public/'.$archivo);
       
//         $srcfile_edit=$archivo;

//         //OBTENEMOS EL NOMBRE DEL ARCHIVO
//         $file=basename($srcfile, ".pdf");
//         //CREAMOS UNA VARIABLE PARA EL NUEVO ARCHIVO CREADO EN CASO DE QUE AL ARCHIVO A EDITAR SEA SUPERIOR A LA VERSION 1.4
//         $srcfile_new=storage_path('/app/public/'.$file."_".".pdf");
        
//         // variable o nombre del documeto validado (igual al nombre original del documento)
//         $srcfile_edit=$file.".pdf";

//         //variable del noimbre del archivo original ,(se borrara el archivo en caso de ocurrir un error con ghostscript)
//         $srcfile_borrar=$file.".pdf";

    
//         // COMPROBAMOS QUE VERSION ES EL ARCHIVO
//         $filepdf = fopen($srcfile,"r");
//         if ($filepdf){
//         $line_first = fgets($filepdf);
//         fclose($filepdf);
//         }else{
//         //echo "error opening the file.";
//         }
//         preg_match_all('!\d+!', $line_first, $matches); 
//         // GUARDAMOS EL NUMERO DE VERSION DEL ARCHIVO EN UNA VARIABLE
//         $pdfversion = implode('.', $matches[0]);

//         ///////////////// SI LA VERSION DEL ARCHIVO  PDF ES INFERIOR A 1.7 ENTRARA AQUI PARA VOLVERLO A LA VERSION 1.7 Y PODER CONTINUAR CON EL PROCESO DE EDICIION ///////////////////////////////

//         if($pdfversion < "1.7"){

//         // SI LA VERSION ES MAYOR A 1.4 LO CONERTIMOS A LA VERSION 1.4 CON GHOSTSCRIPT, AQUI SE DEBE INDICAR LA RUTA DE DONDE ESTA INSTALADO GHOSTSCRIPT, PDFWRITE PARA ESCRIBIR EN EL DOC, EL NIVEL DE COMPATIBILIDAD (1.4), LOS ARCHIVOS TANTO EL NUEVO A CREAR COMO EL DEL CUAL SE VA A REALIZAR LA CONVERSION

//             if(PHP_OS=='WINNT'){ //sistema operativo windows
//                 exec('"C:\Archivos de Programa\gs\gs9.56.1\bin\gswin64.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');   
//             }else{//linux
//                 $exec('gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="'.$srcfile_new.'" "'.$srcfile.'"');
//             }

            
//         }


//         //INSTANCIAMOS LA CLASE PDF PARA TERMINAR DE CREAR EL ARCHIVO
//         $pdf = new EdicionPdfController();
        
//         //CONTAMOS EL NUMERO DE PAGINAS DEL ARCHIVO
//         $pageCount = $pdf->setSourceFile($srcfile);
        
//         $dato_persona=explode(" ", $nombre);
//         $tamanio_dato=sizeof($dato_persona);

//         if($tamanio_dato<3){
//             $apellidos='';
//         }

//         if($tamanio_dato==3){
//             $apellidos=$dato_persona[2];
//         }

//         if($tamanio_dato==4){
//             $apellidos=$dato_persona[2]." ".$dato_persona[3];

//         }

//         if($tamanio_dato==5){
//             $apellidos=$dato_persona[2]." ".$dato_persona[3]." ".$dato_persona[4];
//         }

//         if($tamanio_dato>=6){
//             $apellidos==$dato_persona[2]." ".$dato_persona[3]." ".$dato_persona[4]." ".$dato_persona[5];
//         }
//         // $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 

//         $codigoQR =base64_encode(QrCode::format('png')->size(30)->backgroundColor(255,255,255, 0.5)->generate('FIRMADO POR: '.$nombre."\n". 'RAZON: '.$razon."\n". 'LOCALIZACION: '.$localizacion."\n". "FECHA " .date('Y-m-d H:i:s')."\n". "VALIDAR CON: www.firmadigital.gob.ec"));

//         $TEMPIMGLOC ='DocumentosManuales/tempimg.png'; 
//         $dataURI= "data:image/png;base64,".$codigoQR;
//         $dataPieces = explode(',',$dataURI);
//         $encodedImg = $dataPieces[1]; $decodedImg = base64_decode($encodedImg);  

//         // VERIFICAMOS SI LA IMAGEN FUE DECODIFICADA
//         if( $decodedImg!==false ) {  
//             if( file_put_contents($TEMPIMGLOC,$decodedImg)!==false ) { 
//                 //MANDAMOS A IMPRIMIR LA IMAGEN EN LA RESPECTIVA POSICION                    
//             }
            
//         } 
    
//         // RECORREMOS CADA UNA DE LAS PAGINAS
//         for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            
//             $templateId = $pdf->importPage($pageNo);

//             $pdf->AddPage();
//             // $pdf->AddPage('L','A3');
//             // $pdf->addPage('L','A4');
            
//             //APLICAMOS EL ESTILO SOLO A LA ULTIMA
//             if($pageNo==$pageCount){
//             // if($pageNo==12){

//                 $formato_hoja=$datosHojas->formato;
//                 $orientacion_hoja=$datosHojas->orientacion;
//                 $valorX=$datosHojas->coordenada_x;
//                 $valorY=$datosHojas->coordenada_y;

//                 if($formato_hoja=="A4" && $orientacion_hoja=="H"){$pdf->addPage('L','A4');}
//                 if($formato_hoja=="A4" && $orientacion_hoja=="V"){$pdf->addPage();}

//                 if($formato_hoja=="A3" && $orientacion_hoja=="H"){$pdf->addPage('L','A3');}
//                 if($formato_hoja=="A3" && $orientacion_hoja=="V"){$pdf->addPage('A3');}

//                 if($formato_hoja=="A5" && $orientacion_hoja=="H"){$pdf->addPage('L','A5');}
//                 if($formato_hoja=="A5" && $orientacion_hoja=="V"){$pdf->addPage('A5');}

//                 if($razon=="" && $localizacion=""){
//                     $valorX=$coordenada_x+1;
//                     $valorY=$coordenada_y+1;
//                 }else{
//                     $valorX=$valorX;
//                     $valorY=$valorY;
//                 }


//                 $pdf->SetFont('courier','',5);


//                 $pdf->Image($TEMPIMGLOC,$valorX,$valorY);

//                 $pdf->Text($valorX+14, $valorY+4,utf8_decode("Firmado electrónicamente por:")); 
//                 $pdf->Ln(4); 
//                 $pdf->SetFont('courier','B',7);                        
//                 $pdf->Text($valorX+14, $valorY+7, $dato_persona[0]." ".$dato_persona[1]); 
//                 $pdf->Text($valorX+14, $valorY+10, $apellidos); 

//                 // $pdf->SetTextColor(220,50,50);
//                 // $pdf->Text(105, 253,utf8_decode("Firmado electrónicamente por:")); 
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',9);                        
//                 // $pdf->Text(105, 256, $dato_persona[0]." ".$dato_persona[1]); 
//                 // $pdf->Text(105, 259, $apellidos); 


//                 ///24 de fe
//                 // $pdf->Text(144, 79,utf8_decode("Firmado electrónicamente por:")); 
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);                        
//                 // $pdf->Text(144, 82, $dato_persona[0]." ".$dato_persona[1]); 
//                 // $pdf->Text(144, 85, $apellidos); 

//                 // $pdf->Image($TEMPIMGLOC,130,75);



//                 // // // vertical derecha
//                 // $pdf->Text(126, 148,utf8_decode("Firmado electrónicamente por:")); 
                
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                            
//                 // $pdf->Text(126, 151, $dato_persona[0]." ".$dato_persona[1]); 
                
//                 // $pdf->Text(126, 154, $apellidos); 


//                     // // // vertical izq
//                 //   $pdf->Text(46, 148,utf8_decode("Firmado electrónicamente por:")); 
                
//                 //   $pdf->Ln(4); 
//                 //   $pdf->SetFont('courier','B',7);   
                                
//                 //   $pdf->Text(46, 151, $dato_persona[0]." ".$dato_persona[1]); 
                
//                 //   $pdf->Text(46, 154, $apellidos); 


//                 // plan
//                 // $pdf->Text(134, 149,utf8_decode("Firmado electrónicamente por:")); 
                
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                            
//                 // $pdf->Text(134, 152, $dato_persona[0]." ".$dato_persona[1]); 
                
//                 // $pdf->Text(134, 155, $apellidos); 


//                 //   // // 1 ofcio
//                 //   $pdf->Text(56, 225,utf8_decode("Firmado electrónicamente por:")); 
                
//                 //   $pdf->Ln(4); 
//                 //   $pdf->SetFont('courier','B',7);   
                                
//                 //   $pdf->Text(56, 228, $dato_persona[0]." ".$dato_persona[1]); 
                
//                 //   $pdf->Text(56, 231, $apellidos); 


//                 // 3 ofcio horizontal cronograma 6
//                 // $pdf->Text(356, 116,utf8_decode("Firmado electrónicamente por:")); 
            
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                        
//                 // $pdf->Text(356, 119, $dato_persona[0]." ".$dato_persona[1]); 
            
//                 // $pdf->Text(356, 122, $apellidos); 


//                 // //oficio horizontal 6 d feb .....
//                 // $pdf->Text(344, 131,utf8_decode("Firmado electrónicamente por:")); 
            
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                        
//                 // $pdf->Text(344, 134, $dato_persona[0]." ".$dato_persona[1]); 
            
//                 // $pdf->Text(344, 137, $apellidos); 



//                 // ///horizontal medio
//                 // $pdf->Text(204, 130,utf8_decode("Firmado electrónicamente por:")); 
            
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                        
//                 // $pdf->Text(204, 133, $dato_persona[0]." ".$dato_persona[1]); 
            
//                 // $pdf->Text(204, 136, $apellidos); 

//                 //   ///horizontal medio2
//                 //   $pdf->Text(340, 179,utf8_decode("Firmado electrónicamente por:")); 
            
//                 //   $pdf->Ln(4); 
//                 //   $pdf->SetFont('courier','B',7);   
                            
//                 //   $pdf->Text(340, 182, $dato_persona[0]." ".$dato_persona[1]); 
                
//                 //   $pdf->Text(340, 185, $apellidos); 



//                 //oficio horizontal 6 d feb
//                 // $pdf->Text(340, 186,utf8_decode("Firmado electrónicamente por:")); 
        
//                 // $pdf->Ln(4); 
//                 // $pdf->SetFont('courier','B',7);   
                        
//                 // $pdf->Text(340, 189, $dato_persona[0]." ".$dato_persona[1]); 
            
//                 // $pdf->Text(340, 192, $apellidos); 
                
                
                
//             }
                                    
//             $pdf->useTemplate($templateId, ['adjustPageSize' => false]);  
            
//         }

//         $pdf->Output('F', 'DocumentosManuales/'.$srcfile_edit);

//         $documentoListo = Storage::disk('diskDocumentosManuales')->get($archivo); // obtenemos el documento 
//         Storage::disk('public')->put(str_replace("", "",$srcfile_edit), $documentoListo);

//         $exists_destino = Storage::disk('public')->exists($srcfile_edit); 
//         if($exists_destino){
//             Storage::disk('diskDocumentosManuales')->delete($archivo); // elimnamos el documento 
//             return true;
//         }else{
//             return false;
//         }

//     }catch(\Throwable $th){
//         \Log::error("EdicionPdfController => crear_edicion => Mensaje: ".$th->getMessage()." linea ".$th->getLine());
//         return false;    
//     }

// }