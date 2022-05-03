<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|string|max:255',
            'cedula' => 'required|string|max:13|unique:us001',
            'sexo' => 'required|string|max:10',
            'direccion' => 'required|string|max:500',
            'celular' => 'required|string|min:9|max:10',
            'email' => 'required|string|email|max:255|unique:us001',
            'password' => 'required|string|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {

        $user=new User();
        $user->name=$data['name'];
        $user->cedula=$data['cedula'];
        $user->sexo=$data['sexo'];
        $user->direccion=$data['direccion'];
        $user->celular=$data['celular'];
        $user->email=$data['email'];
        $user->password=bcrypt($data['password']);
        $user->save();
        //PARA GUARDAR LA RELACION DE UN USUARIO Y EL ROL 
        // $userTipoUser= new Usuario_TipoUsuario();
        // $userTipoUser->idus001=$user->idus001;
        // $userTipoUser->idtipoUsuario=2;
        // $userTipoUser->save();
        return $user;

        // return User::create([
        //     'name' => $data['name'],
        //     'email' => $data['email'],
        //     'password' => bcrypt($data['password']),
        // ]);
    }
}
