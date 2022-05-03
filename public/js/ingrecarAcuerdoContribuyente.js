
var tamMax=2; // tamaño maximo del documento

$('#selecArchivoAcuerdo').change(function (e) {

    // primero validamos que solo se ingrese documentos pdf
    var tipoDocSalec=$("#selecArchivoAcuerdo")[0].files[0].type; // obtenemos el tipo de documento seleccionado
    if(tipoDocSalec != "application/pdf"){   
        return;
    }

    // validamos el tamaño del documento seleccionado
    var tamArchivo = $("#selecArchivoAcuerdo")[0].files[0].size; // obtenemos el tamaño del archivo
    var tamArchivo = ((tamArchivo/1024)/1024);
    if(tamArchivo>tamMax){
        alert("El documento no puede tener mas de "+tamMax+"MB");
        return;
    }

    //obtenemos el nombre del archivo selecionado
    archivo="Seleccione un archivo";
    if(this.files.length>0){ // si se a seleccionado un archivo
        archivo=(this.files[0].name);
        $('#VistaPreviaMesj').attr('hidden',true);
        $('#VistaPreviaDoc').attr('hidden',false);
        $('#VistaPreviaDoc').html(`<iframe src="${URL.createObjectURL(e.target.files[0])}" style="width:100%; height: 400px;" frameborder="0"></iframe>`);
        
        $('#nom_doc_seleccionado').val(archivo);
    }else{ // si no se selecciona un archivo
        $('#VistaPreviaMesj').attr('hidden',false);
        $('#VistaPreviaDoc').attr('hidden',true);
        $('#VistaPreviaDoc').html('');
        $('#nom_doc_seleccionado').val("Seleccione un documento");
    }
    
});

 // $('#filexd').click(function(){
    
 //    console.log("click xd d xd");
 // });


function cargarDocumento(btn){
    // reiniciamos la vista previa del documento
    $('#VistaPreviaMesj').attr('hidden',false);
    $('#VistaPreviaDoc').attr('hidden',true);
    $('#VistaPreviaDoc').html('');
    $('#nom_doc_seleccionado').val("Seleccione un documento");

     $(btn).prop('disabled','disabled'); // bloqueamos el boton de agregar docuento
     $('#modal_cargando').show(); // mostramos el mensaje de cargando
     $.get('buscarUs001_cabildo/'+$(btn).val(),function(data){
        console.clear();
        console.log(data);
        if(data.length==0){
             // abrimos una modal informativa
             $('#modal_vista_informacion').modal();
             $(btn).prop('disabled',false);
             $('#modal_cargando').hide(); // ocultamos ventana de carga
             return; // no abrimos la modal del documento
        }
        // almacenamos el estado de la busqueda para retornar al momento de realizar un guardado
        $('#input_estadobusqueda').val($('#i_buscarUsuario').val());

        $('#modal_cargando').hide(); // ocultamos ventana de carga
        $('#selecArchivoAcuerdo').val('');
        $(btn).prop('disabled',false);
        $('#modal_cargando').hide();
        $('#modal_vista_documento').modal(); // mostramos la ventana para seleccionar el archivo

        // agregamos los datos del usuario en la ventara modal
        $('#input_idusuario').val($(btn).siblings('.idusuario_enc').val()); 
        // $('#input_ciu').val($(btn).siblings('.usuario_ciu').val());
        $('#input_codDoc').html($(btn).siblings('.codigo_documento').val());

        // si el ciu es nulo habilitamos el campo para ingresarlo
        if($(btn).siblings('.usuario_ciu').val() && $(btn).siblings('.usuario_ciu').val()>0){
            $('#input_ciu').addClass('soloinfo');
        }else{
            $('#input_ciu').removeClass('soloinfo');
        }
        return;
    });
}

$('#frm_guardarAcuerdo').submit(function(){
    $('#modal_cargando_title').html('Guardando');
    $('#modal_cargando').show(); 
});




// evento del boton guardar docuemtos de la modal

$('#btn_guardaracuerdo').click(function(){
   // $('#frm_guardarAcuerdo').submit();
});

// evento del boton salir de la ventana modal
$('#btn_salirmodal').click(function(){
    $('#input_idusuario').val("");
    $('#input_ciu').val("");
    $('#input_codDoc').html("");
});

// FUNCION PARA CARGAR TABLA CUANDO SE FILTRA EL USUARIO
$('#i_buscarUsuario').keyup(function(e){

    buscar=$(this).val();
    key=0;
    $('#tabla_usuarioCertPendiente').html('');
    $.get('/buscarUSCP/'+buscar, function(request){
        $('#tabla_usuarioCertPendiente').html('');
        $.each(request,function(i, data){
            key++;
            ciu="";
            if(data.ciu){ciu=data.ciu;}
            $('#tabla_usuarioCertPendiente').append(
                `<tr class="even pointer">
                    <td>${key}</td>
                    <td class=" ">${ciu}</td>
                    <td class=" ">${data.name}</td>
                    <td class=" ">${data.cedula}</td>
                    <td class=" ">AC-${data.idus001}-GADMCH</td>
                    <td class=" ">${data.created_at}</td>
                    <td>
                        <div class="frm_addArchivoAcuerdo" id="idencriptado001">
                            <input type="hidden" class="idusuario_enc" value="${data.idEncrypt}">
                            <input type="hidden" class="usuario_ciu" value="${ciu}">
                            <input type="hidden" class="codigo_documento" value="AC-${data.idus001}-GADMCH">
                            <button class="btn btn-primary" value="${data.cedulaEnctypt}" onclick="cargarDocumento(this)">
                                <span class="fa fa-upload"></span> Agregar documento
                            </button>                                           
                        </div>
                    </td>
                </tr>`
            );
        });

    });
});