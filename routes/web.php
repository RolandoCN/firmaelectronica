<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/','HomeController@index');
Auth::routes();
// Route::middleware(['validarRuta'])->group(function() { //middleware para validar el acceso a las rutas de acuerdo al rol asignado

    // para validar que tipo de usuario despues de loguearce
    Route::get('/validarTipoUsuario','ValidarController@verificarUsuario');
    Route::get('/home', 'HomeController@index')->name('home');
    // ruta para mostrar la ventana de seleccionar un tipo de rol
    Route::get('/loginTipoFP','ValidarController@loginTipoFP')->name('loginTipoFP');
    // ruta que realiza el cambio de tipoFP que se selecciona desde la ventata de cambo de tipoFP
    Route::post('/seleccionarTipoFP','ValidarController@seleccionarTipoFP')->name('seleccionarTipoFP');


    //=============== RUTAS PARA EL REGISTRO DE UN FUNCIONARIO ==============
    Route::resource('/registrarUsuario','RegistrarController')->middleware('auth');
    Route::post('/buscarFP','RegistrarController@buscarFP');
    //=======================================================================

    //=============== RUTAS PARA CREAR CUENTAS DE EXTRANJERO ================
    Route::resource('/registrarExtranjero','RegistrarExtranjeroController')->middleware('auth');
    Route::post('/buscarCIU','RegistrarExtranjeroController@buscarCIU')->middleware('auth');
    //=======================================================================

    //=============== RUTAS PARA CREAR INGRESAR CERTIFICADO CUENTA ================
    Route::resource('/certificadoCuenta','CertificadoCuentaController')->middleware('auth');
    Route::get('buscarUSCP/{buscar?}','CertificadoCuentaController@buscarUSCP'); // para buscar usuarios con certificado pendiente
    Route::get('buscarUs001_cabildo/{identificacion}','CertificadoCuentaController@buscarUs001_cabildo'); // para verificar si un usuairo esta registrado en cabildo
    //=======================================================================

    //=============== RUTAS PARA VR PERFIL DE USUARIO Y CAMBIAR CONTRASEÑA ================
    //RUTA PARA CAMBIAR LA CONTRASEÑA
    Route::post('/cambiocontrasena', 'Regis_UserController@cambiarcontrasena')->name('cambiocontrasena');
    Route::post('/cambiarContraseñaperdida', 'RestarurarContraseniaController@cambiarContraseñaperdida')->name('cambiarContraseñaperdida');


    //=======================================================================

    // ruta para mostrar formulacio para solicitar la restauracion de contraseña por el correo electronico
    Route::get('/restaurarCont','RestarurarContraseniaController@index')->name('restaurarCont');


    Route::prefix('firmaArchivo')->group(function(){
        Route::resource('listado', "FirmaDocumentos\FirmaDocumentoController")->middleware('auth');
        Route::get("/cargarListado", "FirmaDocumentos\FirmaDocumentoController@listadoDocumento")->middleware('auth');
        Route::get("/subir", "FirmaDocumentos\FirmaDocumentoController@subirDocumento")->middleware('auth');
        Route::get("/eliminar/{id}", "FirmaDocumentos\FirmaDocumentoController@eliminarDocumento")->middleware('auth');
        Route::post("/nuevoDocumento", "FirmaDocumentos\FirmaDocumentoController@nuevoDocumento")->middleware('auth');
        Route::post("/simulacionFirma", "FirmaDocumentos\FirmaDocumentoController@simulacionFirma")->middleware('auth');
        Route::post('/firmar', 'FirmaDocumentos\FirmaDocumentoController@generar')->middleware('auth');
        Route::get('visualizardoc/{documentName}', 'FirmaDocumentos\FirmaDocumentoController@visualizardoc')->middleware('auth');
        Route::get('descargarDoc/{documentName}','FirmaDocumentos\FirmaDocumentoController@descargarDoc')->middleware('auth');
        Route::post("/eliminarDocumentos", "FirmaDocumentos\FirmaDocumentoController@eliminarDocumentos")->middleware('auth');

    });

    Route::prefix('rolesPago')->group(function(){
        Route::get('generar', 'GestionRolPagoController@index')->middleware('auth');
        Route::get('getDetallePeriodo', 'GestionRolPagoController@getDetallePeriodo')->middleware('auth');
        Route::get('generarPDF', 'GestionRolPagoController@generarPDF')->middleware('auth');
        Route::get('verificarConfigFirmado', 'GestionRolPagoController@verificarConfigFirmado')->middleware('auth'); // ruta para verificar la configuracion del certificado
        Route::post('getRoles', 'GestionRolPagoController@getRoles')->middleware('auth');
        Route::post('generarFirmar', 'GestionRolPagoController@generarFirmarRolesPago')->middleware('auth'); // ruta para generar y firmar los roles de pago
   
    });

    Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


    
        
// });


// Route::get('/', function () {
//     return view('welcome');
// });
