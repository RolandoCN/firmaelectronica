<?php

    session_start();

    //origen de servidores de api
    function getHostServe($server){
        if($server==1){ // servidor de base de datos oracle
            return 'https://wsagua.chone.gob.ec';
            // return 'http://localhost/appServices/public';
        }else if($server==2){ // servidor de base de datos ????
            return '';
        }
    }

    //ruta donde guardar los documentos
    function getRutaDucumento(){
        return "C:/xampp/htdocs/appOnlineFP/public/certificadosDoc/";
        //return "ftp://localhost/appOnlineFP/public/$carpeta";
    }

    // para permitir los formatos de archivo a subir
    function permitirFormato($extension){
        $retorno=false;
        $arrFormatos=array('pdf','PDF','sql','txt');
        foreach ($arrFormatos as $value) {
            if($extension==$value): $retorno=true; continue; endif;
        }
        return $retorno;
    }

    function verificarCedulaRuc($pcedulaRuc){
        // esta funcion si esta registado el ruc o cedula retorna el id del usuario
        // si no es el caso retorna true si esta correcta la cedula o ruc
        // si no lo esta retorna falso
        if($pcedulaRuc==""){return 'I';}

        // primero verificamos que la cedula no exista en los registros
        $cedula = substr($pcedulaRuc, 0,10);
        $existe=App\User::where('cedula','like',"%$cedula%")->first();
        if(!is_null($existe)){
            return $existe->idus001;
        }

        // si no esta registrado procedemos a validar la cedula y el RUC
        // I:invalido
        // V:valido

        $estadoValidado='I';
        if(validarCedula($pcedulaRuc)){
            $estadoValidado='V';
        }

        if(validarRucPersonaNatural($pcedulaRuc)){
            $estadoValidado='V';
        }

        if(validarRucSociedadPrivada($pcedulaRuc)){
            $estadoValidado='V';
        }

        if(validarRucSociedadPublica($pcedulaRuc)){
            $estadoValidado='V';
        }
        return $estadoValidado;

    }


    // para verificar si un request tiene caracteres epeciales
    // retorna verdadero si almenos uno tiene CE
    function tieneCaracterEspecialRequest($request){
        foreach ($request as $key => $parametro) {
            if($key=='_token'):continue;endif; // para no validar el token de laravel
            $resultado=tieneCaracterEspecial($parametro);
            if($resultado==true){
                return true;
            } // si es 1 es porque se han encontrado CE
        }
        return false;
    }

    // para verificar si un campo tiene caracteres epeciales
    // retorna verdadero si  tiene CE   $resultado=preg_match("/[$%&|\/\<>#&=?¿'`*!¡\[\]{}()".'"'."]/",$texto);
    function tieneCaracterEspecial($texto){
        // return false;
        $resultado=preg_match("/[$%&|<>#&*!¡\[\]{}()\"]/",$texto);
        if($resultado==1){
            return true;
        }else{
            return false;
        } // si es 1 es porque se han encontrado CE
    }


    // para validar que la clave sea segura
    function validarClave($clave){
        $resultado=preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/',$clave);
        if($resultado==1):return true; else: return false; endif;
    }

    //para validar que solo sean numeros
    function validarSoloNumero($numero){
        return true;
        // preguntamos si tiene algun signo a 
        
        // codigo en desarrollo
        // la idea es recorrer cada uno de los "numeros" y evaluar si es numero
        // si no lo es retornamos falso
    }

    function tipoUsuario($usid=0){

        if(!auth()->guest()){
            if($usid==0){
                $usid=auth()->user()->idus001;
            }
            $tipousuario=DB::table('us001')
                    ->join('us001_tipoUsuario','us001_tipoUsuario.idus001','=','us001.idus001')
                    ->join('tipoUsuario','tipoUsuario.idtipoUsuario','=','us001_tipoUsuario.idtipoUsuario')
                    ->where('us001.idus001',$usid)
                    ->select('tipoUsuario.*')
                    ->get();

            return response()->json($tipousuario);
        }else{
             return null;
        }
    }

    function userEsTipo($ptipo=''){
        $retorno=false;
        if(!auth()->guest()){
            $tipos_usuario = tipoUsuario(auth()->user()->idus001);
            if(!is_null($tipos_usuario)){
                foreach ($tipos_usuario->original as $key => $item_tipo) {
                    if($item_tipo->tipo==$ptipo){
                        $retorno=true;
                    }
                }
            }
        }
        return $retorno;
    }

    function thisUserEsTipo($ptipo='',$usid){
        $retorno=false;
        if(!auth()->guest()){
            if(!is_null(tipoUsuario($usid))){
                foreach (tipoUsuario($usid)->original as $key => $item_tipo) {
                    if($item_tipo->tipo==$ptipo){
                        $retorno=true;
                    }
                }
            }
        }
        return $retorno;
    }

    function usuarioTieneVariosRoles(){

        $retorno = Collect();

        if(auth()->guest()){ // si no hay usuarios logueados no retornamos nada en el menu
            $retorno->status = false;
            return $retorno;
        }
        $listatipoFPasignados = App\td_us001_tipofpModel::where('idus001',auth()->user()->idus001)->get(); // obtenemos todos los idtipoFP asignados al usuario logueado
        if(sizeof($listatipoFPasignados)>1){
            $retorno->status = true;
            $retorno->listatipoFPasignados = $listatipoFPasignados;
            return $retorno;
        }else if(sizeof($listatipoFPasignados)==1 && userEsTipo('ADFP')){
            $retorno->status = true;
            $retorno->listatipoFPasignados = $listatipoFPasignados;
            return $retorno;
        }
        $retorno->status = false;
        return $retorno;

    }

    function departamentoLogueado(){
        try {
            if(auth()->guest()){ // si no hay usuarios logueados no retornamos nada en el menu
                goto MENU1;
            }else if(auth()->user()->idtipoFP <=0 || is_null(auth()->user()->idtipoFP)){
                goto MENU1;
            }else{
                $objUs001_tipofp = App\td_us001_tipofpModel::with('departamento','tipofp')
                    ->where('idus001',auth()->user()->idus001)
                    ->where('idtipoFP',auth()->user()->idtipoFP)
                    ->first();
                return [
                    'iddepartamento'=>(string)$objUs001_tipofp->departamento->iddepartamento,
                    'departamento' => (string)$objUs001_tipofp->departamento->nombre,
                    'objdepartamento' => $objUs001_tipofp->departamento,
                    'tipoFP' =>(string)$objUs001_tipofp->tipofp->descripcion,
                    'tipoFPtipo' =>(string)$objUs001_tipofp->tipofp->tipo,
                    'jefe_departamento' => $objUs001_tipofp->jefe_departamento,
                    'secre_departamento' => $objUs001_tipofp->secre_departamento,
                    'reasignar_tramite' => $objUs001_tipofp->reasignar_tramite,
                    'ver_todo_tramite' => $objUs001_tipofp->ver_todo_tramite,
                    'cargo' => $objUs001_tipofp->cargo,
                ];

            }
        } catch (\Throwable $th) {
            goto MENU1;
        }

        MENU1:
        return [
            'iddepartamento' => 0,
            'departamento' => "Sin departamento",
            'tipoFP' =>"Sin Tipo",
            'jefe_departamento' => 0,
            'secre_departamento' => 0,
            'reasignar_tramite' => 0,
            'ver_todo_tramite' => 0
        ];

    }



    function jefeDetartamentoLogueado(){

        if(Auth::guest()){
            return false;
        }else{

            // buscamos el jefe de ese departamento
            $depLogueado = departamentoLogueado(); // obtenemos el departameto en el que esta logueado el usuario que va a acrear el tramite
            $jefeDepartamento = App\td_us001_tipofpModel::with('us001') // obtenemos el jefe de ese departamento
                    ->where('iddepartamento',$depLogueado['iddepartamento'])
                    ->where('jefe_departamento','1')
                    ->first();

            if(is_null($jefeDepartamento)){ // si no se encuentra nada no permitimos que ingrese en el modulo
                return false;
            }else{
               return $jefeDepartamento->us001;
            }            
        }

    }

    function listarMenuSession(){
        // FP= funcionario publico

        $consultaMenu = array(); // iniciamos la variable de retorno como un arreglo vacio
        if(auth()->guest()){ // si no hay usuarios logueados no retornamos nada en el menu
            goto FINALM;
        }

        #preguntamos si es un usuario FP administrador en ese caso dejamos que pueda ver todos los menus
        $isAdmin = userEsTipo('ADFP');
        if($isAdmin == true && auth()->user()->idtipoFP==0 ){
            // obtenemos todo el menu de opciones
            $consultaMenu= App\MenuModel::with(['gestion'=>function($query_gestion){ $query_gestion->orderBy('orden','ASC'); }])
                ->orderBy('orden', 'ASC')
                ->get(); 
            goto FINALM;
        }

        #obtenemos todos los menus y validamos el sistema seleccionado

        $consultaMenu= App\MenuModel::with(['gestion'=>function($query_gestion){
            $query_gestion->orderBy('orden','ASC');  
        }])
        ->orderBy('orden', 'ASC')
        ->get(); // obtenemos todo el menu de opciones

            $listatipoFPasignados = App\td_us001_tipofpModel::where('idus001',auth()->user()->idus001)->get(); // obtenemos todos los idtipoFP asignados al usuario logueado

            //validamos si no a seleccionado un tipo de usuario
            if(sizeof($listatipoFPasignados)==0){
                // si no tiene ningun tipo asignado retornamos el menu como vacio
                $consultaMenu = array();
                goto FINALM;
            }else if(sizeof($listatipoFPasignados)==1 && auth()->user()->idtipoFP==0){

                $usuarioLogueado = App\User::find(auth()->user()->idus001); // buscamos el usuario logueado
                $usuarioLogueado->idtipoFP=$listatipoFPasignados[0]->idtipoFP; //actualizamos el idtipoFP con el id del unico tipoFP que tiene asignado
                $usuarioLogueado->save();
            }else if(sizeof($listatipoFPasignados)>1 && auth()->user()->idtipoFP==0){ // si tiene mas de un tipo de usuaio asignado y no a seleccionado uno para iniciar sesion
                return array(); // no retornamos nada porque el usuario no a seleccionado un tipofp
            }




        $idtipoFP=auth()->user()->idtipoFP; // si no FP administrador obtenemos el tipo de usuario
        $tipoFPselec = App\TipoFPModel::where('idtipoFP',$idtipoFP)->first();//obtenemos el tipo fp seleccionado
        $sistema = null;
        if(!is_null($tipoFPselec)){ $sistema = $tipoFPselec->sistema; }

        $tipoFPGestion = App\TipoFPGestionModel::where('idtipoFP',$idtipoFP)->get(); // obtenemos todas las gestiones que tiene asignadas dicho tipo de FP

        foreach ($consultaMenu as $m => $menu){ // recorremos cada uno de los menus
            foreach ($menu->gestion as $g => $gestion) { // recorremos cada una de las gestiones de cada menu
                if($gestion->global == 1){ // permitimos si es una gestion global (que se le permite a todos los usuarios)
                    $gestionasignada=true;
                    continue;
                }
                $gestionasignada=false; // falso si la gestion actual no esta asignada al usuario logueado
                foreach ($tipoFPGestion as $tg => $tipoFP) { // recorremos las gestiones asignadas al usuario y la comparamos con la gestion del menu                    
                    if($gestion->idgestion==$tipoFP->idgestion && is_numeric(strpos($sistema, $gestion->sistema))){
                        $gestionasignada=true;
                        break;                          
                    }
                }              
                if(!$gestionasignada){ // si es falso quiere decir que la gestion no esta asignada al usuario
                    unset($menu->gestion[$g]); // eliminamos la gestion del menu
                }
            }
            // verificamos si el menu ahún contiene gestiones
            if(sizeof($menu->gestion)<=0){ // si no tiene ninguna gestion eliminamos el menu
                unset($consultaMenu[$m]);
            }
        }

        FINALM:
        //dd($consultaMenu);
        return $consultaMenu; // retornamos el menu solo con las gestiones que le pertenecen al usuario

    }



    // función para separar los nombres  y apellidos unidos un una sola cadena
    function separarNombre($full_name){

        $datos =  [];

        //$full_name ='MOREIRA CRUZ RAMONA';

        /* separar el nombre completo en espacios */
        $tokens = explode(' ', trim($full_name));
        /* arreglo donde se guardan las "palabras" del nombre */
        $names = array();
        /* palabras de apellidos (y nombres) compuetos */
        $special_tokens = array('da', 'de', 'del', 'la', 'las', 'los', 'mac', 'mc', 'van', 'von', 'y', 'i', 'san', 'santa');

        $prev = "";
        foreach($tokens as $token) {
            $_token = strtolower($token);
            if(in_array($_token, $special_tokens)) {
                $prev .= "$token ";
            } else {
                $names[] = $prev. $token;
                $prev = "";
            }
        }

        $num_nombres = count($names);
        $nombres = $apellidos = "";
        switch ($num_nombres) {
            case 0:
                $nombres = '';
                break;
            case 1:
                $nombres = $names[0];
                break;
            case 2:
                $nombres    = $names[0];
                $apellidos  = $names[1];
                break;
            case 3:
                $apellidos = $names[0] . ' ' . $names[1];
                $nombres   = $names[2];
            default:
                $apellidos = $names[0] . ' '. $names[1];
                unset($names[0]);
                unset($names[1]);

                $nombres = implode(' ', $names);
                break;
        }

        $datos =  [];

        $datos[0]=$nombres;

        $datos[1]=$apellidos;

        return $datos;

        //return 'Nombres: ' . $nombres . 'Apellidos: '. $apellidos ;

        //$nombres    = mb_convert_case($nombres, MB_CASE_TITLE, 'UTF-8');
        //$apellidos  = mb_convert_case($apellidos, MB_CASE_TITLE, 'UTF-8');

    }







    
    // ============================= FUNCIONES PARA GESTION DE TRAMITES DEPARTAMENTALES =====================

        // funcion que crea el codigo html de un documento
        function getEstructuraDocumento($contenido, $borrador, $cod_documento,$institucion=null){
            //OBTENEMOS LAS IMAGENES CABECERAS PARA SABER SI EL DOCUMENTO SE GENERA DESDE AGUAS O EL GAD
            //si es diferente null viene desde modulo de administracion
            if($institucion==null){
                $depLogueado = departamentoLogueado(); 
                if($depLogueado['objdepartamento']['codigobusqueda']=="EP"){
                    // obtenemso solo el nombre de las imagenes cabecera y pie de pagina
                    $formato=App\Documental\td_FormatoModel::where('codigo','EP')->first();
                }else{
                    // obtenemso solo el nombre de las imagenes cabecera y pie de pagina
                    $formato=App\Documental\td_FormatoModel::where('codigo','GAD')->first();
                }

            }else{
                if($institucion=='EP'){
                    // obtenemso solo el nombre de las imagenes cabecera y pie de pagina
                    $formato=App\Documental\td_FormatoModel::where('codigo','EP')->first();
                }else{
                    // obtenemso solo el nombre de las imagenes cabecera y pie de pagina
                    $formato=App\Documental\td_FormatoModel::where('codigo','GAD')->first();
                }

            }
 
            // // obtenemso solo el nombre de las imagenes cabecera y pie de pagina
            // $formato=App\Documental\td_FormatoModel::where('codigo','GAD')->first();
            $nomCabecera = $resultado = substr( $formato->cabecera, 11); // quitamos el "/tdFormato/" de la consulta
            $nomPie = $resultado = substr($formato->pie, 11); // quitamos el "/tdFormato/" de la consulta
            
            $page_margin_top = $formato->page_margin_top; // margen superor de la pagina
            $page_margin_right = $formato->page_margin_right; // margen derecho de la pagina
            $page_margin_bottom = $formato->page_margin_bottom; // margen inferior de la pagina
            $page_margin_left = $formato->page_margin_left; // margen izquierdo de la pagina

            
            $footer_bottom = $formato->footer_bottom; // borde inferior del footer
            $footer_height = $formato->footer_height; // alto del footer

            $header_top = $formato->header_top; // top del header
            $header_height = $formato->header_height; // alto del header

            $main_left = $formato->main_left; // borde derecho del cuerpo del documento
            $main_right = $formato->main_right; // borde izquierdo del cuerpo del documento

            // combertimos a base64 las imagenes para poder cargarlas
            $cabecera = base64_encode(Storage::disk('tdFormato')->get($nomCabecera));
            $pie = base64_encode(Storage::disk('tdFormato')->get($nomPie));

            // generamos el pdf            
            $pdf = PDF::loadView('tramitesDepartamentales.generarDocumento.cuerpoDocumento',[
                'page_margin_top' => $page_margin_top,
                'page_margin_right' => $page_margin_right,
                'page_margin_bottom' => $page_margin_bottom,
                'page_margin_left' => $page_margin_left,
                'header_top' => $header_top,
                'header_height' => $header_height,
                'footer_bottom' => $footer_bottom,
                'footer_height' => $footer_height,
                'main_right' => $main_right,
                'main_left' => $main_left,
                'cabecera' => $cabecera,
                'pie' => $pie,
                'contenido' => $contenido,
                'borrador' => $borrador,
                'cod_documento' => $cod_documento
            ]);

            $pdf->setPaper("A4", "portrait");
            return $pdf;

        }


        // función para generar el cuerpo del documento (COD DOCUMENTO, PARA, ASUNTO, DE, COPIA)
        function getInfoDocumento(
            $contenido, #codigo hrml del documento
            $asunto, #asunto del trámite
            $listArrPara, #lista de id de departamentos para
            $listArrCopia, #lista de id de departamentos copia
            $idtipoDocumento, #id del tipo de documento seleccionado
            $numReferencia, 
            $listaAnexos,
            $listaAnexosDesc,
            $firma_electronica, 
            $p_fecha, 
            $p_codigoDocumento,
            $guardar_secuencia, #para saber si guardar o no la secuencia
            $configDoc = null,
            $tramite
        ){
           
            // generamos la fecha del documento

                $ciudad_doc = App\Documental\ParametrosGeneralesModel::where("codigo","CIUDADOC")->pluck('valor')->first();
                if(is_null($ciudad_doc)){
                    Log::error("Falta agregar en 'td_parametros_generales' el parametro 'CIUDADOC'");
                    $ciudad_doc="";
                }else{
                    $ciudad_doc = $ciudad_doc.",";
                }

                setlocale(LC_ALL,"es_ES@euro","es_ES","esp"); //IDIOMA ESPAÑOL
                $fecha= date('Y-m-j');
                if(!is_null($p_fecha)){ $fecha = $p_fecha; } // por si se envia una fecha especifica (para no tomar la fecha actual)
                $fecha = strftime("$ciudad_doc %d de %B de %Y", strtotime($fecha));
            
            // obtenemos el año actual
                $anio = date("Y");
            
            // id del departamento logueado
                $iddepartamentoLogueado = departamentoLogueado()['iddepartamento'];
            
            // obtenemos la estructura del documento por el tipo de documento. departamento y por el año
            
                $estrDoc = App\Documental\td_EstructuraDocumentoModel::with('tipo_documento', 'departamento')
                    ->where('idtipo_documento', $idtipoDocumento)
                    ->where('iddepartamento', $iddepartamentoLogueado)
                    ->where('anio', $anio)
                    ->first();

                if(is_null($estrDoc)){ // cremos una nueva estructura de documento
                            
                    $estrDoc = new App\Documental\td_EstructuraDocumentoModel();
                    $estrDoc->anio = $anio;
                    $estrDoc->secuencia = 0;
                    $estrDoc->iddepartamento = $iddepartamentoLogueado;
                    $estrDoc->idtipo_documento = $idtipoDocumento;
                    $estrDoc->estado = 1;
                    
                }

                if(is_null($p_codigoDocumento)){ #no se envio un codigo

                    $estrDoc->secuencia = $estrDoc->secuencia+1; // incrementamos la secuencio del tipo de documento en el departamento
                    if($guardar_secuencia==true){
                        $estrDoc->save();
                    }
                    

                    // generamos el codigo del documento
                    $codigoDocumento = $estrDoc->tipo_documento->estructura."-".$estrDoc->departamento->abreviacion."-".$anio."-".$estrDoc->secuencia."-".$estrDoc->tipo_documento->abreviacion;
                
                }else{
                    $codigoDocumento = $p_codigoDocumento;
                }

            // CREAMOS LA ESTRUCTURA DEL DOCUMENTO (PARA) ----------------------------------------------
                $contentPara="";
                foreach ($listArrPara as $p => $iddepartamentoPara){
                    
                    #buscamos el jefe de ese departamento
                    $departamentoPara = App\DepartamentoModel::with('jefe_departamento')
                        ->where('iddepartamento', $iddepartamentoPara)
                        ->first();

                    $destino_us001name = "";
                    $destino_cargo = "";

                    #verificamos si es departamento administrador de contratos
                    if($departamentoPara->admin_contrato==1){
                        #buscamos el usuario adminstrador de contratos
                        $us001_admincontrato = App\User::with(['admin_contrato'=>function($query)use ($tramite){ 
                            $query->where('estado_del', 0)->where('idtramite', $tramite->idtramite); }])
                            ->whereHas('admin_contrato', function($query2) use ($tramite){
                                $query2->where('idtramite', $tramite->idtramite)->where('estado_del', 0);
                            })
                            ->first();
                        $destino_us001name = $us001_admincontrato->name;
                        if(!is_null($us001_admincontrato->nombre_documental)){ 
                            $destino_us001name = $us001_admincontrato->nombre_documental; 
                        }
                        // //para obtener el codigo de contrato con el tramite 
                        // $codigo_contrato='';
                        // foreach ($us001_admincontrato->admin_contrato as $key2 => $value_admin) {
                        //    if($value_admin->idtramite==$tramite->idtramite){
                        //         $codigo_contrato=$value_admin->codigo;
                        //         break;
                        //    }
                        // }
                        $destino_cargo = "Administrador de Contrato ".$us001_admincontrato->admin_contrato[0]->codigo;
                        
                    }else{
                        $destino_us001name = $departamentoPara->jefe_departamento[0]->us001->name;
                        if(!is_null($departamentoPara->jefe_departamento[0]->us001->nombre_documental)){
                            $destino_us001name = $departamentoPara->jefe_departamento[0]->us001->nombre_documental;
                        }
                        $destino_cargo = $departamentoPara->nombre;
                        if(!is_null($departamentoPara->jefe_departamento[0]->cargo) && $departamentoPara->jefe_departamento[0]->cargo!=""){
                            $destino_cargo = $departamentoPara->jefe_departamento[0]->cargo;
                        }
                    }
                    $texto_aux = "";
                    $style_aux = "margin:0px 0px 4px 0px !important;";
                    if($p==0){ $texto_aux = "PARA:"; }
                    if($p==sizeof($listArrPara)-1){ $style_aux = "margin:0px 0px 9px 0px !important;"; }
                    $contentPara = $contentPara.'
                        <tr>
                            <td class="titulo" style="width: 1px">'.$texto_aux.'</td>
                            <td>
                                <div class="cont_pc" style="'.$style_aux.'">
                                    <span>'.$destino_us001name.'</span><br>
                                    <span class="titulo">'.$destino_cargo.'</span>
                                </div>
                            </td>
                        </tr>
                    ';
                }

            // CREAMOS LA ESTRUCTURA DEL DOCUMENTO (COPIA) ----------------------------------------------
                $contentCopia="";
                $estiloCopia = "display:none;"; // para ocultar la table si no hay copias
                foreach ($listArrCopia as $p => $iddepartamentoCopia){

                    $estiloCopia = ""; // para que no oculte la tabla de copias
                    
                    #buscamos el jefe de ese departamento
                    $departamentoCopia = App\DepartamentoModel::with('jefe_departamento')
                        ->where('iddepartamento', $iddepartamentoCopia)
                        ->first();

                        $destino_us001name = "";
                        $destino_cargo = "";
    
                        #verificamos si es departamento administrador de contratos
                        if($departamentoCopia->admin_contrato==1){
                            #buscamos el usuario adminstrador de contratos
                            $us001_admincontrato = App\User::with(['admin_contrato'=>function($query)use ($tramite){ 
                                $query->where('estado_del', 0)->where('idtramite', $tramite->idtramite); }])
                                ->whereHas('admin_contrato', function($query2) use ($tramite){
                                    $query2->where('idtramite', $tramite->idtramite)->where('estado_del', 0);
                                })
                                ->first();
                            $destino_us001name = $us001_admincontrato->name;
                            if(!is_null($us001_admincontrato->nombre_documental)){ 
                                $destino_us001name = $us001_admincontrato->nombre_documental; 
                            }
                            $destino_cargo = "Administrador de Contrato ".$us001_admincontrato->admin_contrato[0]->codigo;
                            
                        }else{
                            $destino_us001name = $departamentoCopia->jefe_departamento[0]->us001->name;
                            if(!is_null($departamentoCopia->jefe_departamento[0]->us001->nombre_documental)){
                                $destino_us001name = $departamentoCopia->jefe_departamento[0]->us001->nombre_documental;
                            }
                            $destino_cargo = $departamentoCopia->nombre;
                            if(!is_null($departamentoCopia->jefe_departamento[0]->cargo) && $departamentoCopia->jefe_departamento[0]->cargo!=""){
                                $destino_cargo = $departamentoCopia->jefe_departamento[0]->cargo;
                            }
                        }

                    $texto_aux = "";
                    if($p==0){ $texto_aux = "COPIA:"; }
                    $contentCopia = $contentCopia.'
                        <tr>
                            <td class="titulo" style="width: 1px; padding-right: 5px;">'.$texto_aux.'</td>
                            <td>
                                <div class="cont_pc" style="margin:0px 0px 4px 0px !important;">
                                    <span>'.$destino_us001name.'</span><br>
                                    <span class="titulo">'.$destino_cargo.'</span>
                                </div>                            
                            </td>
                        </tr>
                    ';       
                }


            // OBTENEMOS LOS DATOS DEL DEPARTAMENTO LOGUEADO --------------------------------------------
                // buscamos el jefe de ese departamento
                $depLogueado = departamentoLogueado(); //obtenemos el departameto en el que esta logueado el usuario que va a acrear el tramite
                $jefeDepLogueado = App\td_us001_tipofpModel::with('us001', 'departamento') // obtenemos el jefe de ese departamento
                    ->where('iddepartamento',$depLogueado['iddepartamento'])
                    ->where('jefe_departamento','1')
                    ->first();

            // GENERAMOS EL CODIGO PARA MOSTRAR MENSAJE DE FIRMA ELECTRONICA ------------------------
                $text_firma_electronica = "<br><br><br>";
                if($firma_electronica == true){
                    $text_firma_electronica = '<p style="margin-bottom:5px; padding:5px 0px;"><i style="color:blue; font-weight: 700;">Documento firmado electrónicamente</i></p>';
                }

            //GENERAMOS EL CODIGOS PARA EL NUMERO DE REFERENCIA ---------------------------------------------------------
                $content_num_referencia = "";
                if(!is_null($numReferencia) && $numReferencia!=""){
                    $content_num_referencia = "
                        <table style='font-size: 12px;'>
                            <tr>
                                <td class='titulo' style='width: 1px; padding-right: 5px;'>REFERENCIA: </td>
                                <td>$numReferencia</td>
                            </tr>
                        </table>
                    ";
                }               

            // CREAMOS LOS CODIGO DE ANEXOS -------------------------------------------------------------

                $liAnexos = "";
                $content_anexos = "";
                foreach ($listaAnexos as $anx => $codAnexo) {            
                    if(is_null($codAnexo) || $codAnexo==""){                        
                        $liAnexos = $liAnexos."<li>".$listaAnexosDesc[$anx]."</li>";
                    }else{
                        $liAnexos = $liAnexos."<li>$codAnexo</li>";
                    } 
                }

                if($liAnexos != ""){
                    $content_anexos = "
                        <br>
                        <table style='font-size: 12px;'>
                            <tr>
                                <td class='titulo' style='width: 1px; padding-right: 5px;'>ANEXOS: </td>
                                <td style='padding-top: 0;'><ul style='margin-top: 0; padding-top: 0; padding-left: 12px;'>$liAnexos</ul></td>
                            </tr>
                        </table>               
                    ";
                }


            //PREPARAMOS LAS CONFIGURACIONES DEL DOCUMENTO

                       
                #html del codigo del tramite
                $html_cod_tramite = '<br><span class="titulo" style="line-height: 0; display:block; color:#848181;font-weight:bold; font-size:12px">CÓDIGO: GADMC-0000-00000000-N</span>';
                if(!is_null($tramite)){
                    $html_cod_tramite = '<br><span class="titulo" style="line-height: 0; display:block;color:#848181;font-weight:bold; font-size:12px"> CÓDIGO: '.$tramite->codTramite.'</span>';
                } 
                #ocultar codigo del documento
                    $html_codigo_documento = '<span class="titulo" style="line-height: normal;">'.$estrDoc->tipo_documento->descripcion.' Nro. '.$codigoDocumento.'</span> <br>';
                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_codigo==true){
                            $html_codigo_documento = "";
                        }
                    }

                #ocultar fecha del documento
                    $html_fecha_documento = '<span class="titulo" style="line-height: normal;">'.$fecha.'</span>';
                    if(!is_null($configDoc)){
                        if($configDoc->ocultar_fechad==true){
                            $html_fecha_documento = "";
                        }
                    }

                #ocultar asunto
                    $espacio_asunto_para = 'margin-top:15px; margin-bottom:25px;';
                    $html_asunto = ('
                        <tr>
                            <td class="titulo" style="padding-right: 20px; width: max-content;">ASUNTO: </td>
                            <td style="text-transform: uppercase;text-align:justify">'.$asunto.'</td>
                        </tr>
                    ');
                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_asunto==true){
                            $html_asunto = "";
                            $espacio_asunto_para = "";
                        }
                    }

                #ocultar referencia                
                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_refere==true){                            
                            $content_num_referencia = "";
                        }
                    }                                 

                #ocultar anexos
                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_anexos==true){
                            $content_anexos = "";
                        }
                    }

                #mostrar nombre departamento
                    $html_nombre_departamento = "";
                    if(!is_null($configDoc)){                  
                        if($configDoc->mostrar_nomdep==true){
                            $html_nombre_departamento = ('<center><b style="text-transform: uppercase">'.$depLogueado['departamento'].'</b></center><br>');
                        }
                    }

                #ocultar departamentos para
                
                    // $html_departamento_para_ini = ('                 
                    //     <tr>
                    //         <td class="titulo" style="width: 1px">PARA: </td>
                    //         <td>'.$contentPara.'</td>
                    //     </tr>
                    // ');
                    $html_departamento_para_ini = $contentPara;

                    $html_departamento_para_fin = $html_departamento_para_ini;

                    $espacio_asunto_para = 'margin-top:10px; margin-bottom:25px;';
                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_depara==true){
                            $html_departamento_para_ini = "";
                            $html_departamento_para_fin = "";
                            if($configDoc->ocultar_asunto==true){                                
                                $espacio_asunto_para = "";
                            }
                        }
                    }

                #verificamos la posicion de los departamentos para
                    if(!is_null($configDoc)){                  
                        if($configDoc->ubicar_para=="UF"){
                            $html_departamento_para_ini = ""; //quitamos la del inicio
                            $estiloCopia = ""; // para ocultar la table si no hay copias                         
                        }else{
                            $html_departamento_para_fin = ""; //quitamos la del final
                        }
                    }else{
                        $html_departamento_para_fin = ""; //por defecto  quitamos la del final
                    }

                #ocultar departamentos copia
                    // $html_departamento_copia = ('
                    //     <tr>
                    //         <td class="titulo" style="width: 1px; padding-right: 5px;">COPIA: </td>
                    //         <td>'.$contentCopia.'</td>
                    //     </tr>
                    // ');
                    $html_departamento_copia = $contentCopia;

                    if($contentCopia==""){ $html_departamento_copia=""; }

                    if(!is_null($configDoc)){                  
                        if($configDoc->ocultar_copias==true){
                            $html_departamento_copia = "";
                        }
                    }

                #obtenemos el texto de la despedida de la firma
                    $html_despedida_firma = 'Atentamente,';
                    if(!is_null($configDoc)){                  
                        $html_despedida_firma = $configDoc->texto_despe;
                    }

                #obtenemos el nombre del jefe del departamento
                $nombre_jefe_doc = $jefeDepLogueado->us001->name;
                if(!is_null($jefeDepLogueado->us001->nombre_documental) && $jefeDepLogueado->us001->nombre_documental!=""){
                    $nombre_jefe_doc = $jefeDepLogueado->us001->nombre_documental;
                }

                #obtenemos el cargo del jefe del departamento
                $cargo_jefe_doc = $jefeDepLogueado->departamento->nombre;
                if(!is_null($jefeDepLogueado->cargo) && $jefeDepLogueado->cargo!=""){
                    $cargo_jefe_doc = $jefeDepLogueado->cargo;
                }
                
            // CREAMOS EL CONTENIDO DEL DOCUMENTO -------------------------------------------------------
                $texto_documento = '
                    <style type="text/css">
                        .titulo{ font-weight: bold; vertical-align: baseline; }
                        .cont_pc{ margin-bottom: 10px; }
                        .codigo_doc{ text-align: right; line-height: 25px; }
                    </style>                    
                    '.$html_nombre_departamento.'
                    <div class="codigo_doc">                    
                        '.$html_codigo_documento.'                        
                        '.$html_fecha_documento.'
                    </div>

                    <table style="'.$espacio_asunto_para.'">                        
                        '.$html_departamento_para_ini.'
                        '.$html_asunto.'
                    </table>

                        <div class="contenido_html">'.$contenido.'</div>
                        <br>
                        '.$html_despedida_firma.'<br>
                        <br>'.$text_firma_electronica.'<br><br>
                        <div>
                            <span>'.$nombre_jefe_doc.'</span> <br>
                            <span class="titulo">'.$cargo_jefe_doc.'</span>
                        </div>
                    <br>
                    <table style="font-size: 12px; '.$estiloCopia.'">
                        '.$html_departamento_para_fin.'
                        '.$html_departamento_copia.'
                    </table>
                    '.$html_cod_tramite.'
                    '.$content_num_referencia.$content_anexos.'
                ';
            // ---------------------------------------------------------------------
            $retornar = collect();
            $retornar->texto_documento_completo = $texto_documento;
            $retornar->codigo_documento = $codigoDocumento;

            return $retornar;
        }

    //FUNCION PARA VISUALIZAR EL DOCUMENTO DE UN USUARIO INTERNO
            // función para generar el cuerpo del documento (COD DOCUMENTO, PARA, ASUNTO, DE, COPIA)
            function getInfoDocumentoUserinterno(
                $contenido, #codigo hrml del documento
                $asunto, #asunto del trámite
                $listArrPara, #lista de id de departamentos para
                $listArrCopia, #lista de id de departamentos copia
                $idtipoDocumento, #id del tipo de documento seleccionado
                $numReferencia, 
                $listaAnexos,
                $listaAnexosDesc,
                $firma_electronica, 
                $p_fecha, 
                $p_codigoDocumento,
                $guardar_secuencia, #para saber si guardar o no la secuencia
                $configDoc = null,
                $tramite
            ){
               
                // generamos la fecha del documento
    
                    $ciudad_doc = App\Documental\ParametrosGeneralesModel::where("codigo","CIUDADOC")->pluck('valor')->first();
                    if(is_null($ciudad_doc)){
                        Log::error("Falta agregar en 'td_parametros_generales' el parametro 'CIUDADOC'");
                        $ciudad_doc="";
                    }else{
                        $ciudad_doc = $ciudad_doc.",";
                    }
    
                    setlocale(LC_ALL,"es_ES@euro","es_ES","esp"); //IDIOMA ESPAÑOL
                    $fecha= date('Y-m-j');
                    if(!is_null($p_fecha)){ $fecha = $p_fecha; } // por si se envia una fecha especifica (para no tomar la fecha actual)
                    $fecha = strftime("$ciudad_doc %d de %B de %Y", strtotime($fecha));
                
                // obtenemos el año actual
                    $anio = date("Y");
                
                // id del departamento logueado
                    $iddepartamentoLogueado = departamentoLogueado()['iddepartamento'];
                
                // obtenemos la estructura del documento por el tipo de documento. departamento y por el año
                
                    $estrDoc = App\Documental\td_EstructuraDocumentoModel::with('tipo_documento', 'departamento')
                        ->where('idtipo_documento', $idtipoDocumento)
                        ->where('iddepartamento', $iddepartamentoLogueado)
                        ->where('anio', $anio)
                        ->first();
    
                    if(is_null($estrDoc)){ // cremos una nueva estructura de documento
                                
                        $estrDoc = new App\Documental\td_EstructuraDocumentoModel();
                        $estrDoc->anio = $anio;
                        $estrDoc->secuencia = 0;
                        $estrDoc->iddepartamento = $iddepartamentoLogueado;
                        $estrDoc->idtipo_documento = $idtipoDocumento;
                        $estrDoc->estado = 1;
                        
                    }
    
                    if(is_null($p_codigoDocumento)){ #no se envio un codigo
    
                        $estrDoc->secuencia = $estrDoc->secuencia+1; // incrementamos la secuencio del tipo de documento en el departamento
                        if($guardar_secuencia==true){
                            $estrDoc->save();
                        }
                        
    
                        // generamos el codigo del documento
                        $codigoDocumento = $estrDoc->tipo_documento->estructura."-".$estrDoc->departamento->abreviacion."-".$anio."-".$estrDoc->secuencia."-".$estrDoc->tipo_documento->abreviacion;
                    
                    }else{
                        $codigoDocumento = $p_codigoDocumento;
                    }
    
                // CREAMOS LA ESTRUCTURA DEL DOCUMENTO (PARA) ----------------------------------------------
                    $contentPara="";
                    foreach ($listArrPara as $p => $iddepartamentoPara){
                        
                        #buscamos el jefe de ese departamento
                        $departamentoPara = App\DepartamentoModel::with('jefe_departamento')
                            ->where('iddepartamento', $iddepartamentoPara)
                            ->first();
    
                        $destino_us001name = "";
                        $destino_cargo = "";
    
                        #verificamos si es departamento administrador de contratos
                        if($departamentoPara->admin_contrato==1){
                            #buscamos el usuario adminstrador de contratos
                            $us001_admincontrato = App\User::with(['admin_contrato'=>function($query)use ($tramite){ 
                                $query->where('estado_del', 0)->where('idtramite', $tramite->idtramite); }])
                                ->whereHas('admin_contrato', function($query2) use ($tramite){
                                    $query2->where('idtramite', $tramite->idtramite)->where('estado_del', 0);
                                })
                                ->first();
                            $destino_us001name = $us001_admincontrato->name;
                            if(!is_null($us001_admincontrato->nombre_documental)){ 
                                $destino_us001name = $us001_admincontrato->nombre_documental; 
                            }
                            $destino_cargo = "Administrador de Contrato ".$us001_admincontrato->admin_contrato[0]->codigo;
                            
                        }else{
                            $destino_us001name = $departamentoPara->jefe_departamento[0]->us001->name;
                            if(!is_null($departamentoPara->jefe_departamento[0]->us001->nombre_documental)){
                                $destino_us001name = $departamentoPara->jefe_departamento[0]->us001->nombre_documental;
                            }
                            $destino_cargo = $departamentoPara->nombre;
                            if(!is_null($departamentoPara->jefe_departamento[0]->cargo) && $departamentoPara->jefe_departamento[0]->cargo!=""){
                                $destino_cargo = $departamentoPara->jefe_departamento[0]->cargo;
                            }
                        }
    
                        $texto_aux = "";
                        $style_aux = "margin:0px 0px 4px 0px !important;";
                        if($p==0){ $texto_aux = "PARA:"; }
                        if($p==sizeof($listArrPara)-1){ $style_aux = "margin:0px 0px 9px 0px !important;"; }
                        $contentPara = $contentPara.'
                            <tr>
                                <td class="titulo" style="width: 1px">'.$texto_aux.'</td>
                                <td>
                                    <div class="cont_pc" style="'.$style_aux.'">
                                        <span>'.$destino_us001name.'</span><br>
                                        <span class="titulo">'.$destino_cargo.'</span>
                                    </div>
                                </td>
                            </tr>
                        ';
                    }
    
                // CREAMOS LA ESTRUCTURA DEL DOCUMENTO (COPIA) ----------------------------------------------
                    $contentCopia="";
                    $estiloCopia = "display:none;"; // para ocultar la table si no hay copias
                    foreach ($listArrCopia as $p => $iddepartamentoCopia){
    
                        $estiloCopia = ""; // para que no oculte la tabla de copias
                        
                        #buscamos el jefe de ese departamento
                        $departamentoCopia = App\DepartamentoModel::with('jefe_departamento')
                            ->where('iddepartamento', $iddepartamentoCopia)
                            ->first();
    
                            $destino_us001name = "";
                            $destino_cargo = "";
        
                            #verificamos si es departamento administrador de contratos
                            if($departamentoCopia->admin_contrato==1){
                                #buscamos el usuario adminstrador de contratos
                                $us001_admincontrato = App\User::with(['admin_contrato'=>function($query)use ($tramite){ 
                                    $query->where('estado_del', 0)->where('idtramite', $tramite->idtramite); }])
                                    ->whereHas('admin_contrato', function($query2) use ($tramite){
                                        $query2->where('idtramite', $tramite->idtramite)->where('estado_del', 0);
                                    })
                                    ->first();
                                $destino_us001name = $us001_admincontrato->name;
                                if(!is_null($us001_admincontrato->nombre_documental)){ 
                                    $destino_us001name = $us001_admincontrato->nombre_documental; 
                                }
                                $destino_cargo = "Administrador de Contrato ".$us001_admincontrato->admin_contrato[0]->codigo;
                                
                            }else{
                                $destino_us001name = $departamentoCopia->jefe_departamento[0]->us001->name;
                                if(!is_null($departamentoCopia->jefe_departamento[0]->us001->nombre_documental)){
                                    $destino_us001name = $departamentoCopia->jefe_departamento[0]->us001->nombre_documental;
                                }
                                $destino_cargo = $departamentoCopia->nombre;
                                if(!is_null($departamentoCopia->jefe_departamento[0]->cargo) && $departamentoCopia->jefe_departamento[0]->cargo!=""){
                                    $destino_cargo = $departamentoCopia->jefe_departamento[0]->cargo;
                                }
                            }
    
                        $texto_aux = "";
                        if($p==0){ $texto_aux = "COPIA:"; }
                        $contentCopia = $contentCopia.'
                            <tr>
                                <td class="titulo" style="width: 1px; padding-right: 5px;">'.$texto_aux.'</td>
                                <td>
                                    <div class="cont_pc" style="margin:0px 0px 4px 0px !important;">
                                        <span>'.$destino_us001name.'</span><br>
                                        <span class="titulo">'.$destino_cargo.'</span>
                                    </div>                            
                                </td>
                            </tr>
                        ';       
                    }
    
    
                // OBTENEMOS LOS DATOS DEL DEPARTAMENTO LOGUEADO --------------------------------------------
                    // buscamos el jefe de ese departamento
                    $depLogueado = departamentoLogueado(); // obtenemos el departameto en el que esta logueado el usuario que va a acrear el tramite
                    $jefeDepLogueado = App\td_us001_tipofpModel::with('us001', 'departamento') // obtenemos el jefe de ese departamento
                        ->where('iddepartamento',$depLogueado['iddepartamento'])
                        ->where('jefe_departamento','1')
                        ->first();
    
                // GENERAMOS EL CODIGO PARA MOSTRAR MENSAJE DE FIRMA ELECTRONICA ------------------------
                    $text_firma_electronica = "<br><br><br>";
                    if($firma_electronica == true){
                        $text_firma_electronica = '<p style="margin-bottom:5px; padding:5px 0px;"><i style="color:blue; font-weight: 700;">Documento firmado electrónicamente</i></p>';
                    }
    
                //GENERAMOS EL CODIGOS PARA EL NUMERO DE REFERENCIA ---------------------------------------------------------
                    $content_num_referencia = "";
                    if(!is_null($numReferencia) && $numReferencia!=""){
                        $content_num_referencia = "
                            <table style='font-size: 12px;'>
                                <tr>
                                    <td class='titulo' style='width: 1px; padding-right: 5px;'>REFERENCIA: </td>
                                    <td>$numReferencia</td>
                                </tr>
                            </table>
                        ";
                    }               
    
                // CREAMOS LOS CODIGO DE ANEXOS -------------------------------------------------------------
    
                    $liAnexos = "";
                    $content_anexos = "";
                    foreach ($listaAnexos as $anx => $codAnexo) {            
                        if(is_null($codAnexo) || $codAnexo==""){                        
                            $liAnexos = $liAnexos."<li>".$listaAnexosDesc[$anx]."</li>";
                        }else{
                            $liAnexos = $liAnexos."<li>$codAnexo</li>";
                        } 
                    }
    
                    if($liAnexos != ""){
                        $content_anexos = "
                            <br>
                            <table style='font-size: 12px;'>
                                <tr>
                                    <td class='titulo' style='width: 1px; padding-right: 5px;'>ANEXOS: </td>
                                    <td style='padding-top: 0;'><ul style='margin-top: 0; padding-top: 0; padding-left: 12px;'>$liAnexos</ul></td>
                                </tr>
                            </table>               
                        ";
                    }
    
    
                //PREPARAMOS LAS CONFIGURACIONES DEL DOCUMENTO
    
                           
                    #html del codigo del tramite
                    $html_cod_tramite = '<br><span class="titulo" style="line-height: 0; display:block; color:#848181;font-weight:bold; font-size:12px">CÓDIGO: GADMC-0000-00000000-N</span>';
                    if(!is_null($tramite)){
                        $html_cod_tramite = '<br><span class="titulo" style="line-height: 0; display:block;color:#848181;font-weight:bold; font-size:12px"> CÓDIGO: '.$tramite->codTramite.'</span>';
                    } 
                    #ocultar codigo del documento
                        $html_codigo_documento = '<span class="titulo" style="line-height: normal;">'.$estrDoc->tipo_documento->descripcion.' Nro. '.$codigoDocumento.'</span> <br>';
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_codigo==true){
                                $html_codigo_documento = "";
                            }
                        }
    
                    #ocultar fecha del documento
                        $html_fecha_documento = '<span class="titulo" style="line-height: normal;">'.$fecha.'</span>';
                        if(!is_null($configDoc)){
                            if($configDoc->ocultar_fechad==true){
                                $html_fecha_documento = "";
                            }
                        }
    
                    #ocultar asunto
                        $espacio_asunto_para = 'margin-top:15px; margin-bottom:25px;';
                        $html_asunto = ('
                            <tr>
                                <td class="titulo" style="padding-right: 20px; width: max-content;">ASUNTO: </td>
                                <td style="text-transform: uppercase;text-align:justify">'.$asunto.'</td>
                            </tr>
                        ');
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_asunto==true){
                                $html_asunto = "";
                                $espacio_asunto_para = "";
                            }
                        }
    
                    #ocultar referencia                
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_refere==true){                            
                                $content_num_referencia = "";
                            }
                        }                                 
    
                    #ocultar anexos
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_anexos==true){
                                $content_anexos = "";
                            }
                        }
    
                    #mostrar nombre departamento
                        $html_nombre_departamento = "";
                        if(!is_null($configDoc)){                  
                            if($configDoc->mostrar_nomdep==true){
                                $html_nombre_departamento = ('<center><b style="text-transform: uppercase">'.$depLogueado['departamento'].'</b></center><br>');
                            }
                        }
    
                    #ocultar departamentos para
                    
                        // $html_departamento_para_ini = ('                 
                        //     <tr>
                        //         <td class="titulo" style="width: 1px">PARA: </td>
                        //         <td>'.$contentPara.'</td>
                        //     </tr>
                        // ');
                        $html_departamento_para_ini = $contentPara;
    
                        $html_departamento_para_fin = $html_departamento_para_ini;
    
                        $espacio_asunto_para = 'margin-top:10px; margin-bottom:25px;';
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_depara==true){
                                $html_departamento_para_ini = "";
                                $html_departamento_para_fin = "";
                                if($configDoc->ocultar_asunto==true){                                
                                    $espacio_asunto_para = "";
                                }
                            }
                        }
    
                    #verificamos la posicion de los departamentos para
                        if(!is_null($configDoc)){                  
                            if($configDoc->ubicar_para=="UF"){
                                $html_departamento_para_ini = ""; //quitamos la del inicio
                                $estiloCopia = ""; // para ocultar la table si no hay copias                         
                            }else{
                                $html_departamento_para_fin = ""; //quitamos la del final
                            }
                        }else{
                            $html_departamento_para_fin = ""; //por defecto  quitamos la del final
                        }
    
                    #ocultar departamentos copia
                        // $html_departamento_copia = ('
                        //     <tr>
                        //         <td class="titulo" style="width: 1px; padding-right: 5px;">COPIA: </td>
                        //         <td>'.$contentCopia.'</td>
                        //     </tr>
                        // ');
                        $html_departamento_copia = $contentCopia;
    
                        if($contentCopia==""){ $html_departamento_copia=""; }
    
                        if(!is_null($configDoc)){                  
                            if($configDoc->ocultar_copias==true){
                                $html_departamento_copia = "";
                            }
                        }
    
                    #obtenemos el texto de la despedida de la firma
                        $html_despedida_firma = 'Atentamente,';
                        if(!is_null($configDoc)){                  
                            $html_despedida_firma = $configDoc->texto_despe;
                        }
    
                    #obtenemos el nombre del jefe del departamento
                    $nombre_jefe_doc = $jefeDepLogueado->us001->name;
                    if(!is_null($jefeDepLogueado->us001->nombre_documental) && $jefeDepLogueado->us001->nombre_documental!=""){
                        $nombre_jefe_doc = $jefeDepLogueado->us001->nombre_documental;
                    }
    
                    #obtenemos el cargo del jefe del departamento
                    $cargo_jefe_doc = $jefeDepLogueado->departamento->nombre;
                    if(!is_null($jefeDepLogueado->cargo) && $jefeDepLogueado->cargo!=""){
                        $cargo_jefe_doc = $jefeDepLogueado->cargo;
                    }
                    // dd($depLogueado['departamento']);
                    $nombre_jefe_doc=auth()->user()->name;
                    if(auth()->user()->nombre_documental!=null || auth()->user()->nombre_documental!=''){
                        $nombre_jefe_doc=auth()->user()->nombre_documental;
                    }
                    $cargo_jefe_doc=$depLogueado['departamento'];
                    if(!is_null($depLogueado['cargo']) && $depLogueado['cargo']!=""){
                        $cargo_jefe_doc=$depLogueado['cargo'];
                    }
                // CREAMOS EL CONTENIDO DEL DOCUMENTO -------------------------------------------------------
                    $texto_documento = '
                        <style type="text/css">
                            .titulo{ font-weight: bold; vertical-align: baseline; }
                            .cont_pc{ margin-bottom: 10px; }
                            .codigo_doc{ text-align: right; line-height: 25px; }
                        </style>                    
                        '.$html_nombre_departamento.'
                        <div class="codigo_doc">                    
                            '.$html_codigo_documento.'                        
                            '.$html_fecha_documento.'
                        </div>
    
                        <table style="'.$espacio_asunto_para.'">                        
                            '.$html_departamento_para_ini.'
                            '.$html_asunto.'
                        </table>
    
                            <div class="contenido_html">'.$contenido.'</div>
                            <br>
                            '.$html_despedida_firma.'<br>
                            <br>'.$text_firma_electronica.'<br>
                            <div>
                                <span>'.$nombre_jefe_doc.'</span> <br>
                                <span class="titulo">'.$cargo_jefe_doc.'</span>
                            </div>
                        <br>
                        <table style="font-size: 12px; '.$estiloCopia.'">
                            '.$html_departamento_para_fin.'
                            '.$html_departamento_copia.'
                        </table>
                        '.$html_cod_tramite.'
                        '.$content_num_referencia.$content_anexos.'
                    ';
                // ---------------------------------------------------------------------
                $retornar = collect();
                $retornar->texto_documento_completo = $texto_documento;
                $retornar->codigo_documento = $codigoDocumento;
    
                return $retornar;
            }
    // ============================= /FUNCIONES PARA GESTION DE TRAMITES DEPARTAMENTALES =====================



    // funcion que retorna todo lo de la tabla de parametros generales
    function parametros_generales(){
        $parGenFormato = App\Documental\ParametrosGeneralesModel::all();
        return $parGenFormato;
    }


?>