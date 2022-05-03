<?php

namespace App\FirmarDocumentos;

use Illuminate\Database\Eloquent\Model;

class ParametroHojaModel extends Model
{
    protected $table = 'firma_parametros';
    protected $primaryKey  = 'idfirma_parametros';
    public $timestamps = false;
}