<?php

namespace App\Http\Middleware;

use Closure;
use DB;
class Administrador
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
        if(auth()->guest()){goto MENU;}
  
        if (!userEsTipo('ADFP')) {
            MENU:
            return redirect('/login');
        }else{
            return $next($request);
        }
        
    }
}
