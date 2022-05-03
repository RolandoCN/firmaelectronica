<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FirmaElectronicaModel extends Model
{
    protected $table = 'td_firma_electronica';
    protected $primaryKey  = 'idfirma_electronica';
    public $timestamps = false;
}
