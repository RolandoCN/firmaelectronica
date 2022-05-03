<?php

namespace App\FirmarDocumentos;

use Illuminate\Database\Eloquent\Model;

class FirmarDocumentosModel extends Model
{
    protected $table = 'coact_firma_documentos';
    protected $primaryKey  = 'idcoact_firma_documentos';
    public $timestamps = true;
}