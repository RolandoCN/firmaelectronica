<?php

namespace App\Http\Controllers;
use App\Log;
use App\TipoFPModel;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        if(auth()->guest()){
            // goto RETORNARHOME;
            return redirect('/login');
        }


        RETORNARHOME:
        return view('home');
    }

    public function validar($numero){

        $retorno=validarCedula($numero);
        dd($retorno);
    }

}
