<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;


class User extends Authenticatable 
{
    use Notifiable;
    
    protected $table = 'us001';
    protected $primaryKey  = 'idus001';
    protected $appends = ['idus001_encrypt'];

    public function getIdus001EncryptAttribute()
    {
        return encrypt($this->attributes['idus001']);
    }

    public function us001_tpofp(){
        return $this->hasMany('App\td_us001_tipofpModel', 'idus001', 'idus001')->with('tipofp','departamento');
    }
    public function us001_tpofp_admin_contrato(){
        return $this->hasMany('App\td_us001_tipofpModel', 'idus001', 'idus001')->with('tipofp_documental')->wherehas('tipofp_documental',function($query){
            $query->where('SISTEMA','DOC');
        })->where('jefe_departamento',1);
    }


    public function detalle_tramite(){
        return $this->hasMany('App\Documental\td_DetalleTramiteModel', 'idus001Atiende', 'idus001');
    }

    public function us001_tipoUsuario(){
        return $this->hasMany('App\Us001_tipoUsuarioModel', 'idus001', 'idus001')->with('TipoUsuario');
    }

    public function usuarioActivicadControlProyecto(){
        return $this->hasMany('App\ActividadProyectoModel', 'idus001_responsable', 'idus001')->where('estadoDel',0);
    }

    public function admin_contrato(){
        return $this->hasMany('App\Documental\td_AdminContratoModel', 'idus001', 'idus001');
    }
  
    public function us001_tipo_rol_mv(){
        return $this->hasMany('App\MantenimientoVehicular\TipoRolPersonaModel', 'idus001', 'idus001')->with('tipo') ->whereHas('tipo',function($query){
                        $query->where('detalle','Chofer')->where('estado','Activo');
                });
    }

    public function emision(){
        return $this->hasMany('App\EmisionModel', 'idus001', 'idus001')->where('estado_emision','=', "A")->whereDate('fecha_emision','>=','2021-04-20')->where('emision_cabildo','=',null);
    }


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

}
