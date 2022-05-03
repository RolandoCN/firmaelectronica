<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use App\FirmaElectronicaModel;
use App\ParametrosGeneralesModel;
use App\RolPagoGeneradoModel;
use App\PeriodoRegimenModel;
use App\RolCorreosNulos;
use App\BSrE_PDF_Signer_Cli;
use App\Http\Controllers\FirmarDocumentoManualesController;
use PDF;
use Log;
use Mail;

class GestionRolPagoController extends Controller
{

      
    

    // función para verificar la configuración de la firma
    public function verificarConfigFirmado(){

        try{

            $mensajeError = "";

            // ------------- para saber que tieme configurado el usuario

                $config_firma = [
                    "archivo_certificado"=>false, // no hay archivo agregado
                    "clave_certificado"=>false, // no hay clave registrada
                    "dias_valido"=>0, // el numero de dias validos del certificado cargado
                    "dias_notific_expira"=>10, // si un certificado tiene estos dia de vigencia, se notifica que esta por expirar
                    "dias_permitir_firmar"=>1, // días mínimo de vigencia de certificado para firmar documentos
                ];

            // ------------- obtenemos la firma del usuario ---------

                $firma_electronica = FirmaElectronicaModel::where('idus001', auth()->user()->idus001)->first();

                if(!is_null($firma_electronica)){ // ya se registró una firma en base de datos

                    if(!is_null($firma_electronica->archivo_certificado)){
                        $config_firma["archivo_certificado"] = true; // hay un archivo agregado
                        
                        //obtenemos los dias validos del certificado cardago
                        $fecha_actual = date('Y-m-d H:m:s');
                        $fecha_hasta = $firma_electronica->fecha_hasta;
                        $dias_valido = (strtotime($fecha_actual)-strtotime($fecha_hasta))/86400;
                        if(strtotime($fecha_actual)>=strtotime($fecha_hasta)){ $dias_valido=0;}
                        $dias_valido = abs($dias_valido); 
                        $dias_valido = floor($dias_valido);
                        $config_firma["dias_valido"] = $dias_valido;

                        //obtenemos los dias que se considera que un certificado esta por expirar
                        $dias_notific_expira = ParametrosGeneralesModel::where('codigo','NOTEXPIRCER')->pluck('valor')->first();
                        if(!is_null($dias_notific_expira)){ $config_firma["dias_notific_expira"] = $dias_notific_expira; }

                        //obtenemos los días mínimo de vigencia de certificado para firmar documentos
                        $dias_permitir_firmar = ParametrosGeneralesModel::where('codigo','MINPERFIRMAR')->pluck('valor')->first();
                        if(!is_null($dias_permitir_firmar)){ if($dias_permitir_firmar>1){ $config_firma["dias_permitir_firmar"] = $dias_permitir_firmar; } }
    
                    }

                    if(!is_null($firma_electronica->clave_certificado)){
                        $config_firma["clave_certificado"] = true;  // hay una clave registrada
                    }

                }

            // ------------------------------


                return response()->json([
                    "error" => false,
                    "config_firma" => $config_firma
                ]);
         
            
            RETORNARERROR:
                return response()->json([
                    "error" => true,
                    "mensaje" => $mensajeError,
                    "status" => "error"
                ]);

        }catch (\Throwable $th){
            Log::error("FirmarDocumentoManualesController => verificarConfigFirmado => Mensaje:".$th->getMessage());
            return response()->json([
                "error" => true,
                "mensaje" => "No se pudo verificar la configuración de la firma electrónica",
                "status" => "error"
            ]);
        }


    }

}
