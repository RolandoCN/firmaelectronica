<?php

namespace App\Http\Middleware;

use Closure;

class ValidarRutaPorTipoFP
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //FP=funcionario publico
        //ADFP=Usuario administrador

        if(auth()->guest()){ // si no hay usuarios logueados
            goto PERMITIR;
        }

        if(userEsTipo('ADFP')){goto PERMITIR;} // preguntamos si es un usuario FP administrador en ese caso permitimos el acceso a la ruta
        
        //verficamos si tiene la ruta asignada
        $idtipoFP=auth()->user()->idtipoFP;
        $rutaLlamada = \Request::route()->uri; // obtenemos el nombre de la ruta que se esta llamando
        $metodo = $_SERVER['REQUEST_METHOD'];
      
        //solo validamos para las petisiones get
        if($metodo!="GET" && $metodo!="get" && $metodo!="Get"){ goto PERMITIR; }

        //solo hacemos la validación para las rutas que esten registradas en la tabla "gestion"
        $rutaregistrada = \App\GestionModel::where('ruta', $rutaLlamada)->first();
       
        if(is_null($rutaregistrada)){ goto PERMITIR; }
        if($rutaregistrada->global==1){ goto PERMITIR; } //es una ruta que se le permite acceder a todos los usuarios      

        //validación de la ruta llamada
        $rutaAsignada = \App\TipoFPGestionModel::with('gestion')
            ->whereHas('gestion', function($query_gestion) use($rutaLlamada){ 
                $query_gestion->where('ruta', $rutaLlamada); 
            })
            ->where('idtipoFP',$idtipoFP)
            ->first();
          
        if(!is_null($rutaAsignada)){
            goto PERMITIR;
        }

        // si no se encuentran coincidencias se redirecciona al login
        NOPERMIRIR:
        return redirect('/login');

        PERMITIR:
        return $next($request);
    }
}
