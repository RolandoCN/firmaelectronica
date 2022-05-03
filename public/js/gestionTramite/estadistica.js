    

    //=======================================================================================================
    //=========================== PARA LA CARGA DE GRAFICAS =================================================
    //=======================================================================================================
    
        //variable para las graficas

        color_torta = [
            '#0e68a7', '#d10609', '#ff7f12', '#179517',
            '#980597', '#68a90b', '#04787b', '#16a3ef'
        ]

        color_pr = [ // color (primero oscuro)
            '#34495E', '#26B99A', '#f98b3d', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ];

        color_pv = [ // color (primero verde)
            '#26B99A', '#34495E', '#f98b3d', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ];

        var theme = {
            color: [
                '#26B99A', '#34495E', '#f98b3d', '#3498DB',
                '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
            ],

            title: {
                itemGap: 8,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#408829'
                }
            },

            dataRange: {
                color: ['#1f610a', '#97b58d']
            },

            toolbox: {
                color: ['#408829', '#408829', '#408829', '#408829']
            },

            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.5)',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#408829',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#408829'
                    },
                    shadowStyle: {
                        color: 'rgba(200,200,200,0.3)'
                    }
                }
            },

            dataZoom: {
                dataBackgroundColor: '#eee',
                fillerColor: 'rgba(64,136,41,0.2)',
                handleColor: '#408829'
            },
            grid: {
                borderWidth: 0
            },

            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },

            valueAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },
            timeline: {
                lineStyle: {
                    color: '#408829'
                },
                controlStyle: {
                    normal: {color: '#408829'},
                    emphasis: {color: '#408829'}
                }
            },

            k: {
                itemStyle: {
                    normal: {
                        color: '#68a54a',
                        color0: '#a9cba2',
                        lineStyle: {
                            width: 1,
                            color: '#408829',
                            color0: '#86b379'
                        }
                    }
                }
            },
            map: {
                itemStyle: {
                    normal: {
                        areaStyle: {
                            color: '#ddd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    },
                    emphasis: {
                        areaStyle: {
                            color: '#99d2dd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    }
                }
            },
            force: {
                itemStyle: {
                    normal: {
                        linkStyle: {
                            strokeColor: '#408829'
                        }
                    }
                }
            },
            chord: {
                padding: 4,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    },
                    emphasis: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                }
            },
            gauge: {
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                        width: 8
                    }
                },
                axisTick: {
                    splitNumber: 10,
                    length: 12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length: 18,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    length: '90%',
                    color: 'auto'
                },
                title: {
                    textStyle: {
                        color: '#333'
                    }
                },
                detail: {
                    textStyle: {
                        color: 'auto'
                    }
                }
            },
            textStyle: {
                fontFamily: 'Arial, Verdana, sans-serif'
            }
        };


        // funciona para cargar el grafico de barras
        function cargar_grafico_barras(lista_estadistica){

            var addTema = theme;
            var estado_tramite = $('.estado_tramite:checked').val();
            if(estado_tramite=="P"){addTema.color = color_pr; }else{ addTema.color = color_pv; }

            var echartBar = echarts.init(document.getElementById('grafica_promedio_atencion'), addTema);

            var data_category = [];
            var data_value_f = []; //los finalizados
            var data_value_p = []; //los pendientes

            $.each(lista_estadistica,function(category, valor){
                data_category.push(category);
                data_value_f.push(valor.finalizados);
                data_value_p.push(valor.pendientes);
            });

            //verficicamos que estado dibijar
            var data_series=[];
            if(estado_tramite=="T"){
                estado_tramite = "Finalizados y Pendientes";
                data_series.push(
                    {
                        name: `Total (Finalizados)`,
                        type: 'bar',
                        data: data_value_f,
                        // markPoint: { data: [{ type: 'max', name: '???' }, { type: 'min', name: '???' }] }, markLine: { data: [{ type: 'average', name: '???' }] }
                    },
                    {
                        name: `Total (Pendientes)`,
                        type: 'bar',
                        data: data_value_p,
                        // markPoint: { data: [{ type: 'max', name: '???' }, { type: 'min', name: '???' }] }, markLine: { data: [{ type: 'average', name: '???' }] }
                    }
                );
            }else if(estado_tramite=="F"){
                estado_tramite="Finalizados";
                data_series.push(
                    {
                        name: `Total (Finalizados)`,
                        type: 'bar',
                        data: data_value_f,
                        // markPoint: { data: [{ type: 'max', name: '???' }, { type: 'min', name: '???' }] }, markLine: { data: [{ type: 'average', name: '???' }] }
                    }
                );
            }else{
                estado_tramite="Pendientes";
                data_series.push(
                    {
                        name: `Total (Pendientes)`,
                        type: 'bar',
                        data: data_value_p,
                        // markPoint: { data: [{ type: 'max', name: '???' }, { type: 'min', name: '???' }] }, markLine: { data: [{ type: 'average', name: '???' }] }
                    }
                );
            }

            //cargamos la grafica
            echartBar.setOption({
                title: {
                    text: `Total de trámites generados (${estado_tramite})`,
                    subtext: ''
                },
                tooltip: { trigger: 'axis' },
                legend: { x: 'center', y: 'bottom',  data: [`Total`] },
                toolbox: { show: true },
                calculable: false,
                xAxis: [{ type: 'category', data: data_category }],
                yAxis: [{ type: 'value' }],
                series: data_series
            });  
            console.warn("Grafico actualizado");      
        }


        // funcion para cargar la gratica de torna
        function cargar_grafica_torta(lista_estadistica){

            var addTema = theme;        
            addTema.color = color_torta;

            var echartPie = echarts.init(document.getElementById('grafica_distribucion_atencion'), addTema);
            var dataGrafica = [];

            //creamos la data para enviarla al grafico
           $.each(lista_estadistica, function(category, valor){
                dataGrafica.push({
                    value: valor.total,
                    name: category
                });
           });
            
            //cargamos la grafica
            echartPie.setOption({
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                legend: { x: 'center', y: 'top', data: ['Izquierda', 'Derecha'] },
                calculable: true,
                series: [{
                    name: 'Porcentaje',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '48%'],
                    data: dataGrafica
                }]
            });

        } 




    //=======================================================================================================
    //=========================== FUNCIONES DE CONSULTA =====================================================
    //=======================================================================================================


        // evento del formulario para filtrar la estadisticas
        $("#frm_consultar_estadistica").submit(function(e){ 
            e.preventDefault();
            vistacargando("M","Espere...");

            $.ajaxSetup({
                headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var FrmData = new FormData(this);
            $("#mensajeInfo").hide(200);

            $.ajax({
                url: '/gestionTramite/filtrarEstadistica', 
                method: "POST", 
                data: FrmData,
                type: "json",
                contentType:false,
                cache:false,
                processData:false,             
                complete: function (request)   
                {
                    vistacargando();
                    var retorno = request.responseJSON;
                    console.log(retorno);
                    // 
                    if(retorno.error==true){                                            
                        mostrarMensaje(retorno.mensaje, retorno.status, "mensajeInfo");
                    }else{
                        $("#informacion_inicio").hide();
                        $(".grafico_estadistico").show();
                        cargar_grafico_barras(retorno.lista_estadistica);
                        cargar_grafica_torta(retorno.lista_estadistica);
                    }
                    
                },error: function(){
                    vistacargando();
                }
            });
            
        });


        $('.tipomuestra').on('ifChecked', function(event){
            // filtrarEstadistica();
        });


        // función que se desencade al cambiar un combo de los tipo de trámite 
        function seleccionarCombo(cmb){
            var option_sel= $(cmb).find('option:selected');
            var valor_sel=$(option_sel).attr('data-id');
            if(valor_sel==0){
                $(option_sel).prop('selected', false);
                $(cmb).find('.option').prop('selected', true);
                $(cmb).trigger("chosen:updated");
            }
        }

        // función que se desencadena al cambiar el valor del comobo de medio de consulta
        function seleccionarMedio(cmb){
            var valor = $(cmb).val();
            if(valor=="TC"){
                $("#content_tipo_proceso").show(300);
                $("#content_tipo_certificado").hide(300);
            }else if(valor=="SC"){
                $("#content_tipo_certificado").show(300);
                $("#content_tipo_proceso").hide(300);
            }else{ // asumimos que el valor es 0 Todos
                $("#content_tipo_proceso").show(300);
                $("#content_tipo_certificado").show(300);
            }
        }


        // EVENTOS QUE SE DESENCADENAS AL CAMBIAR EL ESTADO DEL CHECK_FILTRAR_FECHA
        $('#check_filtrar_fecha').on('ifChecked', function(event){ // si se checkea
            $("#content_filtrar_fecha").show(200);
        });
        
        $('#check_filtrar_fecha').on('ifUnchecked', function(event){ // si se deschekea
            $("#content_filtrar_fecha").hide(200);
        });


        //FUNCION PARA AGREGAR UN MENSAJE EN LA PANTALLA
        function mostrarMensaje(mensaje, status, idelement){
            var contenidoMensaje=`
                <div style="font-weight: 700; margin: 0px 10px 20px 10px;" class="alert alert-${status} alert-dismissible alert_sm" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <strong>MENSAJE! </strong> <span> ${mensaje}</span>
                </div>
            `;
            $("#"+idelement).html(contenidoMensaje);
            $("#"+idelement).show(500);
            
            // setTimeout(() => {
            //     $("#"+idelement).hide(500);
            // }, 8000);
        }


