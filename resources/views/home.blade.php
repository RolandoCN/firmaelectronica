@extends('layouts.service')

@section('contenido')

    {{-- MENSAJE DE INFORMACIÓN PARA LA VISTA PRINCIPAL --}}
    @if(session()->has('mensajeGeneral'))
        <script type="text/javascript">
            $(document).ready(function () {
                new PNotify({
                    title: 'Mensaje de Información',
                    text: '{{session('mensajeGeneral')}}',
                    type: '{{session('status')}}',
                    hide: true,
                    delay: 8000,
                    styling: 'bootstrap3',
                    addclass: 'mensajeInfo'
                });
            });
        </script> 
    @endif

<div class="row">
<div class="col-md-12 col-sm-12 col-xs-12">
	    <center>
	    	<img  width="70%"  src="images/logochoneR.png" style="opacity: 0.2;margin-top:4%;">
	    </center>
    </div>
</div>
@endsection