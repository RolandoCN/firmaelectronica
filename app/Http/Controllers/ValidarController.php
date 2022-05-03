<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use \App\Us001_tipoUsuarioModel;
use \App\User;
use \App\TipoFPModel;

class ValidarController extends Controller
{
    function verificarUsuario(){

        return redirect('/');

        // verificamos que el usuario sea un funcionario publico
        // ya que solo ellos pueden acceder al sistema
        session_destroy();
        $isAdmin = userEsTipo('ADFP');
        
        if(!userEsTipo('FP') && $isAdmin==false){ 
            auth()->logout(); // deslogueamos si no es usuario fp
            return redirect('/login'); // redireccionamos al login
        }else{

            //verificamos si esta dado de baja
            if(auth()->user()->estado=="E"){
                auth()->logout(); // deslogueamos 
                return redirect('/login')->with(['user_baja'=>true]); // redireccionamos al login y decimos que: "El usuario ha sido dado de baja"
            }

            // if(userEsTipo('ADFP')){return redirect("/");} // preguntamos si es un usuario FP administrador en ese caso dejamos que pueda ver todos los menus

            $usuarioLogueado = User::find(auth()->user()->idus001); // buscamos el usuario logueado
            $usuarioLogueado->idtipoFP=0; //actualizamos el idtipoFP como cero  para obligar a seleciconar un tipo fp
            $usuarioLogueado->save();   

            return redirect('/');
           

            $listatipoFPasignados = \App\td_us001_tipofpModel::where('idus001',auth()->user()->idus001)->get(); // obtenemos todos los idtipoFP asignados al usuario logueado
            //validamos si no a seleccionado un tipo de usuario (codigo en desarrollo)
            
            if(sizeof($listatipoFPasignados)==0){
                // si no tiene ningun tipo asignado retornamos al inicio
                return redirect('/');
            }
            // }else if(sizeof($listatipoFPasignados)==1){ // si solo tiene un solo usuario agregado
            //     if($isAdmin == true){ return redirect("/loginTipoFP"); }
            //     $usuarioLogueado->idtipoFP=$listatipoFPasignados[0]->idtipoFP; //actualizamos el idtipoFP como cero  para obligar a seleciconar un tipo fp
            //     $usuarioLogueado->save();
            //     return redirect('/');
            // }else if(sizeof($listatipoFPasignados)>1){ // si tiene mas de un tipo de usuaio asignado y no a seleccionad uno para iniciar sesion                
            //     return redirect("/loginTipoFP"); // redireccionamos para que seleccione el tipofp que desea
            // }

        }
        
    }

    function loginTipoFP(){
        if(auth()->guest()){ // si no hay usuarios logueados no retornamos nada en el menu
            return redirect('/login');
        }else{
            // validamos que el usuario tenga varios roles, ya que solo si tiene mas de uno puede acceder a esta ventana
            if(usuarioTieneVariosRoles()->status==false){return back();}
            //obtenemos los tipos de usuarios que tiene asignado
            $listatipoFPasignados = \App\td_us001_tipofpModel::with('tipofp','departamento')
                ->where('idus001',auth()->user()->idus001)
                ->get(); // obtenemos todos los idtipoFP asignados al usuario logueado
            
            return view("auth.loginTipoFP")->with([
                'listatipoFPasignados'=>$listatipoFPasignados
            ]);            
        }

    }

    public function seleccionarTipoFP(Request $request){

        if(isset($request->cmb_seleccionarTipoFP)){

            $cmb_idtipoFP=decrypt($request->cmb_seleccionarTipoFP);

            #registramos el tipo seleccionado
            $usuarioLogueado = User::find(auth()->user()->idus001);
            $usuarioLogueado->idtipoFP = $cmb_idtipoFP;
            $usuarioLogueado->save();
            return redirect("/");
        }else{
            return back();
        }

    }


}
