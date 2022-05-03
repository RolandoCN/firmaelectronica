    
    // color: [
    //     '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
    //     '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
    // ]
    
//variable para las graficas
var theme = {
    color: [
        '#0e68a7', '#d10609', '#ff7f12', '#179517',
        '#980597', '#68a90b', '#04787b', '#16a3ef'
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

var app = {};

// var chartDom = document.getElementById('grafica_general');
// var myChart = echarts.init(chartDom,theme,'dark');
// var option;

const posList = [
  'left',
  'right',
  'top',
  'bottom',
  'inside',
  'insideTop',
  'insideLeft',
  'insideRight',
  'insideBottom',
  'insideTopLeft',
  'insideTopRight',
  'insideBottomLeft',
  'insideBottomRight'
];
app.configParameters = {
  rotate: {
    min: -90,
    max: 90
  },
  align: {
    options: {
      left: 'left',
      center: 'center',
      right: 'right'
    }
  },
  verticalAlign: {
    options: {
      top: 'top',
      middle: 'middle',
      bottom: 'bottom'
    }
  },
  position: {
    options: posList.reduce(function (map, pos) {
      map[pos] = pos;
      return map;
    }, {})
  },
  distance: {
    min: 0,
    max: 100
  }
};
app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
    onChange: function () {
        const labelOption = {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance
        };
        myChart.setOption({
        series: [
            {
            label: labelOption
            },
            {
            label: labelOption
            },
            {
            label: labelOption
            },
            {
            label: labelOption
            }
        ]
        });
    }
};
const labelOption = {
    show: true,
    position: app.config.position,
    distance: app.config.distance,
    align: app.config.align,
    verticalAlign: app.config.verticalAlign,
    rotate: app.config.rotate,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
        name: {}
    }
    
};



    //cargar graficos al inicio
    $(document).ready(function () {
        if($('#control_usuario').val()=='1'){
            barras();
        }
        barra_departamento();
        return;
    });


    // funciona para cargar el grafico de tiempo medio de trámites
    function estadistica_pastel(usuario='T'){


        // if(fechain=='' && fechafin==''){
        //     $('#pastel_pendientes').show();
        //     $('#grafica_general').show();
        //     var chartDom = document.getElementById('grafica_general');
        //     var chartpendiente= document.getElementById('pastel_pendientes');
        //     var myChart = echarts.init(chartDom,theme);
        //     var graficopendiente = echarts.init(chartpendiente,theme);
        //     var option;
        //     var data_category_atendidos = [];
        //     var data_category_pendientes = [];
        //     $('#tabla_datos').hide(200);
        //     var con=0;
        //     data =  $('#input_listTiemMedioTram').data("field-id");

        //     //creamos la data para enviarla al grafico
        //     $.each(data,function(i,item){
        //             //construir la data
        //             data_category_atendidos[con]={value: item['atendidos'].length, name: i}
        //             data_category_pendientes[con]={value: (item['entrada'].length)+(item['elaboracion'].length)+(item['revision'].length), name: i}

        //             con=con+1;

        //     });
        //     optionAtendidos = {
        //         title: {
        //         text: 'Resumen de trámites'
        //         },
        //         tooltip: {
        //         trigger: 'item',
        //         formatter: "{d}%",
        //         },
        
        //         legend: {
        //         orient: 'horizontal',
        //         left: 'left'
        //         },
                
        //         series: [
        //             {
        //                 // name: 'Atendidos',
        //                 type: 'pie',
        //                 radius: '50%',
        //                 data: data_category_atendidos,
        //                 label : {
        //             　　　　normal : {
        //             　　　　　　formatter: '{b} ({d}%)',
        //             　　　　}
        //             　　},

        //             },
                
        //             ],
        //             emphasis: {
        //                 itemStyle: {
        //                 shadowBlur: 10,
        //                 shadowOffsetX: 0,
        //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             },
        //     };

        //     optionPendientes= {
        //         title: {
        //         text: 'Trámites Pendientes'
        //         },
        //         tooltip: {
        //         trigger: 'item',
        //         formatter: "{d}%",
        //         },
        
        //         legend: {
        //         orient: 'horizontal',
        //         left: 'left'
        //         },
                
        //         series: [
        //             {
        //                 // name: 'Atendidos',
        //                 type: 'pie',
        //                 radius: '50%',
        //                 data: data_category_pendientes,
        //                 label : {
        //                     　　　　normal : {
        //                     　　　　　　formatter: '{b} ({d}%)',
        //                     　　　　}
        //                     　　},

        //             },
                
        //             ],
        //             emphasis: {
        //                 itemStyle: {
        //                 shadowBlur: 10,
        //                 shadowOffsetX: 0,
        //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             },
        //     };
            
        //     myChart.setOption(optionAtendidos);
        //     graficopendiente.setOption(optionPendientes);
        // }else if(fechain=='' || fechafin==''){
        //     return;
        // }else{
            vistacargando('m','Por favor espere');
            $.get(`/estadistica/estadisticas_user/`+usuario, function(data){
                $('#pastel_pendientes').show();
                $('#grafica_general').show();
                var chartDom = document.getElementById('grafica_general');
                var chartpendiente= document.getElementById('pastel_pendientes');
                var myChart = echarts.init(chartDom,theme);
                var graficopendiente = echarts.init(chartpendiente,theme);
                var option;
                var data_category_atendidos = [];
                var data_category_pendientes = [];
                $('#tabla_datos').hide(200);
                var con=0;
                //creamos la data para enviarla al grafico
                if(usuario =='T' || usuario=='0'){
                    $.each(data,function(i,item){
                        //construir la data
                        data_category_atendidos[con]={value: item['atendidos'], name: i}
                        data_category_pendientes[con]={value: (item['entrada'])+(item['elaboracion'])+(item['revision']), name: i}

                        con=con+1;
        
                    });
                    optionAtendidos = {
                        title: {
                        text: 'Trámites Atendidos'
                        },
                        tooltip: {
                        trigger: 'item',
                        formatter: "{d}%",
                        },
                
                        legend: {
                        orient: 'horizontal',
                        left: 'left'
                        },
                        
                        series: [
                            {
                                // name: 'Atendidos',
                                type: 'pie',
                                radius: '50%',
                                label : {
                                    　　　　normal : {
                                    　　　　　　formatter: '{b} ({d}%)',
                                    　　　　}
                                    　　},
                                data: data_category_atendidos
        
                            },
                        
                            ],
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                    };
        
                    optionPendientes= {
                        title: {
                        text: 'Trámites Pendientes'
                        },
                        tooltip: {
                        trigger: 'item',
                        formatter: "{d}%",
                        },
                
                        legend: {
                        orient: 'horizontal',
                        left: 'left'
                        },
                        
                        series: [
                            {
                                // name: 'Atendidos',
                                type: 'pie',
                                radius: '50%',
                                data: data_category_pendientes,
                                label : {
                            　　　　normal : {
                            　　　　　　formatter: '{b} ({d}%)',
                            　　　　}
                            　　},

                            },
                        
                            ],
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                    };
                    
                    myChart.setOption(optionAtendidos);
                    graficopendiente.setOption(optionPendientes);
                    vistacargando();

                }else{

                    $('#pastel_pendientes').hide();
                    var nombre_usuario='';
                    $.each(data,function(i,item){
                        //construir la data
                        data['entrada']=item['entrada'];
                        data['elaboracion']=item['elaboracion'];
                        data['revision']=item['revision'];
                        data['atendidos']=item['atendidos'];
                        nombre_usuario=i;

                        con=con+1;
        
                    });
                    optionAtendidos = {
                        title: {
                            text: 'Resumen de trámite de '+nombre_usuario
                        },
                        tooltip: {
                        trigger: 'item',
                        formatter: "{d}%",
                        },
                
                        legend: {
                        orient: 'horizontal',
                        left: 'left'
                        },
                        
                        series: [
                            {
                                // name: 'Atendidos',
                                type: 'pie',
                                radius: '50%',
                                data: [
                                    { value: data['entrada'], name: 'Entrada' },
                                    { value: data['elaboracion'], name: 'Elaboración' },
                                    { value: data['revision'], name: 'Revisión' },
                                    { value: data['atendidos'], name: 'Atendidos'},
                                  ],
                                label : {
                            　　　　normal : {
                            　　　　　　formatter: '{b} ({d}%)',
                            　　　　}
                            　　},
        
                            },
                        
                            ],
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                    };
        
                                  
                    myChart.setOption(optionAtendidos);
                    vistacargando();
                }

            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente');
                vistacargando();
            });
        // }

  
    }

    function barras(usuario='T'){
     

        // if(fechain=='' && fechafin==''){
        //     var data_category = [];
        //     var serie_entrada=[];
        //     var serie_elaboracion=[];
        //     var serie_revision=[];
        //     var serie_atendidos=[];
        //     $('#grafica_general').show();
        //     $('#pastel_pendientes').hide();
        //     $('#tabla_datos').hide(200);
        //     var chartDom = document.getElementById('grafica_general');
        //     var myChart = echarts.init(chartDom,theme,'dark');
        //     var option;
        //     data =  $('#input_listTiemMedioTram').data("field-id");
        //     //creamos la data para enviarla al grafico
        //     $.each(data,function(i,item){
        //             data_category.push(i);
        //             serie_entrada.push(item['entrada'].length);
        //             serie_elaboracion.push(item['elaboracion'].length);
        //             serie_revision.push(item['revision'].length);
        //             serie_atendidos.push(item['atendidos'].length);

        //     });
        //     option = {
        //         title: {
        //             text: 'Resumen de trámites'
        //             // subtext: 'Tiempo promedio'
        //         },
        //         tooltip: {
        //         trigger: 'axis',
        //         axisPointer: {
        //             type: 'shadow'
        //         }
        //         },
        //         legend: {
        //         data: ['Entrada', 'Elaboración', 'Revisión','Atendidos']
        //         },
        //         toolbox: {
        //         show: true,
        //         orient: 'vertical',
        //         left: 'right',
        //         top: 'center',
        //         feature: {
        //             mark: { show: true },
        //             dataView: { show: true, readOnly: false },
        //             magicType: { show: true, type: ['line', 'bar', 'stack'] },
        //             restore: { show: true },
        //             saveAsImage: { show: true }
        //         }
        //         },
        //         xAxis: [
        //         {
        //             type: 'category',
        //             axisTick: { show: false },
        //             data: data_category,
        //             axisLabel: {
        //                 interval: 0, 
        //                 rotate: 20,
        //             }
                    

        //         }
        //         ],
        //         yAxis: [
        //         {
        //             type: 'value',
                    
        //         }
        //         ],
        //         series: [
        //         {
        //             name: 'Entrada',
        //             type: 'bar',
        //             barGap: 0,
        //             label: labelOption,
        //             emphasis: {
        //             focus: 'series'
        //             },
        //             data: serie_entrada
        //         },
        //         {
        //             name: 'Elaboración',
        //             type: 'bar',
        //             label: labelOption,
        //             emphasis: {
        //             focus: 'series'
        //             },
        //             data: serie_elaboracion
        //         },
        //         {
        //             name: 'Revisión',
        //             type: 'bar',
        //             label: labelOption,
        //             emphasis: {
        //             focus: 'series'
        //             },
        //             data: serie_revision
        //         },
        //         {
        //             name: 'Atendidos',
        //             type: 'bar',
        //             label: labelOption,
        //             emphasis: {
        //             focus: 'series'
        //             },
        //             data: serie_atendidos
        //         }
        //         ]
        //     };
        //     myChart.setOption(option);
        // }else if(fechain=='' || fechafin==''){
        //     return;
        // }else{
            vistacargando('m', 'Por favor espere');
            $.get(`/estadistica/estadisticas_user/`+usuario, function(data){
                var data_category = [];
                var serie_entrada=[];
                var serie_elaboracion=[];
                var serie_revision=[];
                var serie_atendidos=[];
                $('#grafica_general').show();
                $('#pastel_pendientes').hide();
                $('#tabla_datos').hide(200);
                var chartDom = document.getElementById('grafica_general');
                var myChart = echarts.init(chartDom,theme,'dark');
                var option;
                //creamos la data para enviarla al grafico
                $.each(data,function(i,item){
                        data_category.push(i);
                        serie_entrada.push(item['entrada']);
                        serie_elaboracion.push(item['elaboracion']);
                        serie_revision.push(item['revision']);
                        serie_atendidos.push(item['atendidos']);
    
                });
                option = {
                    title: {
                        text: 'Resumen de trámites'
                        // subtext: 'Tiempo promedio'
                    },
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                    },
                    legend: {
                    data: ['Entrada', 'Elaboración', 'Revisión','Atendidos']
                    },
                    toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar', 'stack'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                    },
                    xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        data: data_category,
                        axisLabel: {
                            interval: 0, 
                            rotate: 20,
                        }
                        
    
                    }
                    ],
                    yAxis: [
                    {
                        type: 'value',
                        
                    }
                    ],
                    series: [
                    {
                        name: 'Entrada',
                        type: 'bar',
                        barGap: 0,
                        label: labelOption,
                        emphasis: {
                        focus: 'series'
                        },
                        data: serie_entrada
                    },
                    {
                        name: 'Elaboración',
                        type: 'bar',
                        label: labelOption,
                        emphasis: {
                        focus: 'series'
                        },
                        data: serie_elaboracion
                    },
                    {
                        name: 'Revisión',
                        type: 'bar',
                        label: labelOption,
                        emphasis: {
                        focus: 'series'
                        },
                        data: serie_revision
                    },
                    {
                        name: 'Atendidos',
                        type: 'bar',
                        label: labelOption,
                        emphasis: {
                        focus: 'series'
                        },
                        data: serie_atendidos
                    }
                    ]
                };
                myChart.setOption(option);
                vistacargando();
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente');
                vistacargando();
            });
        // }
    }

    function tabla_usuario(usuario='T'){
            vistacargando('m','Por favor espere');
            $('#body_pg').html('');
            $("#table_pg").DataTable().destroy();
            $('#table_pg tbody').empty();
            var cumplimiento='No aplica';
            $.get(`/estadistica/estadisticas_user/${usuario}`, function(data){
             
                $.each(data, function(i, item){
                    var cumplimiento='No aplica';
                    if(item['elaboracion']>0 || item['revision']>0 || item['atendidos']>0 || item['revision']>0){
                        cumplimiento=((item['atendidos']*100)/(item['entrada']+item['elaboracion']+item['revision']+item['atendidos'])).toFixed(2)+'%';
                    }
                    $('#body_pg').append(`<tr  role="row" class="odd">
                        <td colspan="1" width="20%">
                            ${[i]}
                        </td>
                        <td align="center" colspan="1">
                            <a style="cursor:pointer" onclick="detalle_tramites('${item['idus001']}','E')"><u>${item['entrada']}</u></a>
                        </td>
                        <td align="center" colspan="1">
                            <a style="cursor:pointer" onclick="detalle_tramites('${item['idus001']}','B')"><u>${item['elaboracion']}</u></a>
                        </td>
                        <td align="center"  colspan="1">
                            <a style="cursor:pointer" onclick="detalle_tramites('${item['idus001']}','R')"><u>${item['revision']}</u></a>
                        </td>
                        <td align="center"  colspan="1">
                            <a style="cursor:pointer" onclick="detalle_tramites('${item['idus001']}','A')"><u>${item['atendidos']}</u></a>
                        </td>
                        <td align="center"  colspan="1">
                            ${item['entrada']+item['elaboracion']+item['revision']}
                        </td>
                        <td align="center" style="color:green"  colspan="1">
                            <b>${item['entrada']+item['elaboracion']+item['revision']+item['atendidos']}</b>
                        </td>
                        <td align="center" style="color:green"  colspan="1">
                            <b>${cumplimiento}</b>
                        </td>
                    </tr>  `);
                });
                cargar_estilos_tabla("table_pg");
                vistacargando();
            });
        // }
    }


    function filtrarEstadistica(){
        // var fechain=$('#est_fechaInicio').val();
        // var fechafin=$('#est_fechaFin').val();
        var inputs=$('.inpust_user').find('input');
        var usuario = $("#cmb_usuarios").val();
        $.each(inputs,function(i2,item2){
            if(item2.checked){
                tipo=item2.value;
            }
        })
        // console.log(usuario);
        // console.log(tipo);
        if(usuario==0){
            usuario='T';
        }
        if(tipo=='B'){
            barras(usuario);

        }
        if(tipo=='P'){
            estadistica_pastel(usuario);

        }
        if(tipo=='T'){
            tabla_usuario(usuario);
            $('#tabla_datos').show();
            $('#pastel_pendientes').hide();
            $('#grafica_general').hide();


        }
    }

    function pastel_departamento(){
 
        var data=null;
       
        // if(fechain=='' && fechafin==''){
        //     $('#estadistica_departamento').show();
        //     $('#estadistica_departamento_barra').hide();
        //     var chart_departamento = document.getElementById('estadistica_departamento');
        //     var graficodepartamento = echarts.init(chart_departamento,theme);
        //     data =  $('#input_tramite_departamento').data("field-id");
        //     optionDepartamentos = {
        //         title: {
        //           text: 'Trámites Atendidos'
        //         },
        //         tooltip: {
        //           trigger: 'item',
        //           formatter: "{d}%",
        //         },
          
        //         legend: {
        //           orient: 'horizontal',
        //           left: 'left'
        //         },
                
        //         series: [
        //             {
        //                 name: 'Entrada',
        //                 type: 'pie',
        //                 radius: '50%',
        //                 label : {
        //                     　　　　normal : {
        //                     　　　　　　formatter: '{b} ({d}%)',
        //                     　　　　}
        //                     　　},
        //                 data: [
        //                     { value: data['entrada'], name: 'Entrada' },
        //                     { value: data['elaboracion'], name: 'Elaboración' },
        //                     { value: data['revision'], name: 'Revisión' },
        //                     { value: data['atendidos'], name: 'Atendidos'},
        //                   ],

        //             },
                   
        //             ],
        //             emphasis: {
        //                 itemStyle: {
        //                   shadowBlur: 10,
        //                   shadowOffsetX: 0,
        //                   shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //               },
        //     };
        //     graficodepartamento.setOption(optionDepartamentos);

          
        // }else if(fechain=='' || fechafin==''){
        //     return;
        // }else{
            $('#estadistica_departamento').show();
            $('#estadistica_departamento_barra').hide();
            var chart_departamento = document.getElementById('estadistica_departamento');
            var graficodepartamento = echarts.init(chart_departamento,theme);
            var data=null;
            vistacargando('m','Por favor espere..');
            $.get('/estadistica/estadistica_dep',function(data_dep){
                data=data_dep; 
                optionDepartamentos = {
                    title: {
                      text: 'Trámites Atendidos'
                    },
                    tooltip: {
                      trigger: 'item',
                      formatter: "{d}%",
                    },
              
                    legend: {
                      orient: 'horizontal',
                      left: 'left'
                    },
                    
                    series: [
                        {
                            name: 'Entrada',
                            type: 'pie',
                            radius: '50%',
                            label : {
                                　　　　normal : {
                                　　　　　　formatter: '{b} ({d}%)',
                                　　　　}
                                　　},
                            data: [
                                { value: data['entrada'], name: 'Entrada' },
                                { value: data['elaboracion'], name: 'Elaboración' },
                                { value: data['revision'], name: 'Revisión' },
                                { value: data['atendidos'], name: 'Atendidos'},
                              ],
    
                        },
                       
                        ],
                        emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          },
                };
                graficodepartamento.setOption(optionDepartamentos);
                vistacargando();
         
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente');
                vistacargando();
            });;
        // }
 
    }

    function barra_departamento(){
       
       
        var data=null;
     
            $('#estadistica_departamento').hide();
            $('#estadistica_departamento_barra').show();
            var chart_barra_dep = document.getElementById('estadistica_departamento_barra');
            var grafico_barra_dep = echarts.init(chart_barra_dep,theme);
            var option;
            vistacargando('m','Por favor espere...');
            $.get('/estadistica/estadistica_dep',function(data_dep){
                data=data_dep;
                option = {
                    title: {
                        text: 'Resumen de trámites'
                        // subtext: 'Tiempo promedio'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                    xAxis: [
                    {
                        type: 'category',
                         splitLine: { show: false },
                        data: ['Entrada', 'Elaboración', 'Revisión','Atendidos'],
                    }
                    ],
                    yAxis: [
                    {
                        type: 'value',
                        
                    }
                    ],
                    series: [
                    {
                        name: 'Total',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                          },
                        data: [data['entrada'],data['elaboracion'],data['revision'],data['atendidos']]
                    },
                    
                    
                    ]
                };
                grafico_barra_dep.setOption(option);
                vistacargando();
   
            });

    }

    function filtrarEstadistica_dep(){
        var inputs=$('.inputs').find('input');
        $.each(inputs,function(i2,item2){
            if(item2.checked){
                tipo=item2.value;
            }
        })
        if(tipo=='B'){
            barra_departamento();
            $('#tabla_datos_dep').hide();

        }
        if(tipo=='P'){
            pastel_departamento();
            $('#tabla_datos_dep').hide();
        }
        if(tipo=='T'){
        
            tabla_departamento();

        }

       return;
    }

    function tabla_departamento(){
        
            $('#body_lista_dep').html('');
            $('#table_dep').DataTable().destroy();
            $('#table_dep tbody').empty();
            vistacargando('m','Por favor espere');
            var cumplimiento='No Aplica'
            $.get('/estadistica/estadistica_dep',function(data_dep){
                if(data_dep['elaboracion']>0 || data_dep['revision']>0 || data_dep['atendidos']>0 || data_dep['revision']>0){
                    cumplimiento=((data_dep['atendidos']*100)/(data_dep['entrada']+data_dep['elaboracion']+data_dep['revision']+data_dep['atendidos'])).toFixed(2)+'%';
                }
                $('#body_lista_dep').html(`<tr>
                <td>${data_dep['entrada']}</td>
                <td>${data_dep['elaboracion']}</td>
                <td>${data_dep['revision']}</td>
                <td>${data_dep['atendidos']}</td>
                <td>${data_dep['entrada']+data_dep['elaboracion']+data_dep['revision']}</td>
                <td>${data_dep['entrada']+data_dep['elaboracion']+data_dep['revision']+data_dep['atendidos']}</td>
                <td align="center" style="color:green"  colspan="1">
                    <b>${cumplimiento}</b>
                </td>
                </tr>`);
                
                vistacargando();
                $('#tabla_datos_dep').show();
                $('#estadistica_departamento').hide();
                $('#estadistica_departamento_barra').hide();
            }).fail(function(){
                alertNotificar('Ocurrió un error intente nuevamente');
                vistacargando();
            });;

    }


    function detalle_tramites(idusuario,tipo){
        $('#tbody_detalle').html('');
        $('#tabla_detalle').DataTable().destroy();
        $('#tabla_detalle tbody').empty();
        vistacargando('m','Por favor espere');
        $.get('/estadistica/detalle/'+idusuario+'/'+tipo,function(data){
            console.log(data);
            if(data['error']==true){
                alertNotificar('Ocurrió un error intente nuevamente','danger');
                return;
            }
            $.each(data['detalle'], function(i, item){
                var color_dias='';
                if(tipo=='E'){
                    $('#dias_trans').show();
                    if(item['detalle_actividad']['dias']>3){
                        color_dias='red';
                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['detalle_actividad']['detalle_tramite']['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['detalle_actividad']['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['detalle_actividad']['fecha']}<br>
                            <b>Usuario envía: </b>  ${item['detalle_actividad']['us001_envia']['name']}

                        </td>
                        <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                            <b>${item['detalle_actividad']['dias']}</b>
                        </td>
                    </tr>  `);
                }
                if(tipo=='B'){
                    if(item['dias']>3){
                        color_dias='red';
                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['detalle_tramite']['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['fecha']}<br>
                            <b>Usuario envía: </b>  ${item['us001_envia']['name']}

                        </td>
                        <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                            <b>${item['dias']}</b>
                        </td>
                    </tr>  `);
                }
                if(tipo=='R'){
                    if(item['dias']>3){
                        color_dias='red';
                    }
                    if(item['usuario_devuelve']!=null){
                        var userdevuelve=item['usuario_devuelve']['name'];
                    }else{
                        var userdevuelve='----';

                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['detalle_tramite']['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['fecha']}<br>
                            <b>Usuario envía: </b>  ${userdevuelve}<br>
                            <b>Detalle revisión: </b>  ${item['detRevision']}<br>
                        </td>
                        <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                            <b>${item['dias']}</b>
                        </td>
                    </tr>  `);
                }
                if(tipo=='A'){
                    
                    if(item['detalle_tramite']['tramite']['finalizado']==1){
                        var estado='Finalizado';
                    }else{
                        var estado='Pendiente';

                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['detalle_tramite']['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['fecha']}<br>
                            <b>Estado: </b>  ${estado}<br>

                        </td>
                        <td  width="5%" align="center" colspan="1">
                           No disponible
                        </td>
                    </tr>  `);
                }
                
            });
        $('#modal_detalle').modal();
        vistacargando();
        cargar_estilos_tabla('tabla_detalle');
        })
    }

    function detalle_tramites_departamento(tipo){
        $('#tbody_detalle').html('');
        $('#tabla_detalle').DataTable().destroy();
        $('#tabla_detalle tbody').empty();
        vistacargando('m','Por favor espere');
        $.get('/estadistica/detalle_departamento/'+tipo,function(data){
            console.log(data);
            if(data['error']==true){
                alertNotificar('Ocurrió un error intente nuevamente','danger');
                return;
            }
            $.each(data['detalle'], function(i, item){
                var color_dias='';
                if(tipo=='E'){
                    $('#dias_trans').show();
                    if(item['detalle_tramite']['dias']>3){
                        color_dias='red';
                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['detalle_tramite']['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['detalle_tramite']['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['detalle_tramite']['fecha']}<br>
                            <b>Departamento origen: </b>  ${item['detalle_tramite']['departamento_origen']['nombre']}

                        </td>
                        <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                            <b>${item['detalle_tramite']['dias']}</b>
                        </td>
                    </tr>  `);
                }
                if(tipo=='B'){
                    if(item['dias']>3){
                        color_dias='red';
                    }
                    $('#tbody_detalle').append(`<tr  role="row" class="odd">
                        <td>${i+1}</td>
                        <td colspan="1" width="20%">
                            ${item['tramite']['codTramite']}
                        </td>
                        <td align="left" colspan="1">
                            ${item['asunto']}
                        </td>
                        <td style="font-size:9px" align="left" colspan="1">
                            <b>Fecha: </b>  ${item['fecha']}<br>
                        </td>
                        <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                            <b>${item['dias']}</b>
                        </td>
                    </tr>  `);
                }
                if(tipo=='R'){
                    // if(item['detalle_tramite']['dias']>3){
                    //     color_dias='red';
                    // }
                    // if(item['usuario_devuelve']!=null){
                    //     var depdevuelve=item['usuario_devuelve']['name'];
                    // }else{
                    //     var depdevuelve='----';

                    // }
                    // $('#tbody_detalle').append(`<tr  role="row" class="odd">
                    //     <td>${i+1}</td>
                    //     <td colspan="1" width="20%">
                    //         ${item['detalle_tramite']['tramite']['codTramite']}
                    //     </td>
                    //     <td align="left" colspan="1">
                    //         ${item['asunto']}
                    //     </td>
                    //     <td style="font-size:9px" align="left" colspan="1">
                    //         <b>Fecha: </b>  ${item['fecha']}<br>
                    //         <b>Usuario envía: </b>  ${userdevuelve}<br>
                    //         <b>Detalle revisión: </b>  ${item['detRevision']}<br>
                    //     </td>
                    //     <td style="color:${color_dias}" width="5%" align="center" colspan="1">
                    //         <b>${item['dias']}</b>
                    //     </td>
                    // </tr>  `);
                }
                if(tipo=='A'){
                    
                    // if(item['detalle_tramite']['tramite']['finalizado']==1){
                    //     var estado='Finalizado';
                    // }else{
                    //     var estado='Pendiente';

                    // }
                    // $('#tbody_detalle').append(`<tr  role="row" class="odd">
                    //     <td>${i+1}</td>
                    //     <td colspan="1" width="20%">
                    //         ${item['detalle_tramite']['tramite']['codTramite']}
                    //     </td>
                    //     <td align="left" colspan="1">
                    //         ${item['asunto']}
                    //     </td>
                    //     <td style="font-size:9px" align="left" colspan="1">
                    //         <b>Fecha: </b>  ${item['fecha']}<br>
                    //         <b>Estado: </b>  ${estado}<br>

                    //     </td>
                    //     <td  width="5%" align="center" colspan="1">
                    //        No disponible
                    //     </td>
                    // </tr>  `);
                }
                
            });
        $('#modal_detalle').modal();
        vistacargando();
        cargar_estilos_tabla('tabla_detalle');
        })
    }

    function cargar_estilos_tabla(idtabla){

        $(`#${idtabla}`).DataTable({
            dom: ""
            +"<'row' <'form-inline' <'col-sm-6 inputsearch'f>>>"
            +"<rt>"
            +"<'row'<'form-inline'"
            +" <'col-sm-6 col-md-6 col-lg-6'l>"
            +"<'col-sm-6 col-md-6 col-lg-6'p>>>",
            "destroy":true,
            order: [[ 0, "asc" ]],
            pageLength: 5,
            sInfoFiltered:false,
            "language": lenguajeTabla
        });
    
        // para posicionar el input del filtro
        $(`#${idtabla}_filter`).css('float', 'left');
        $(`#${idtabla}_filter`).children('label').css('width', '100%');
        $(`#${idtabla}_filter`).parent().css('padding-left','0');
        $(`#${idtabla}_wrapper`).css('margin-top','10px');
        $(`input[aria-controls="${idtabla}"]`).css({'width':'100%'});
        $(`input[aria-controls="${idtabla}"]`).parent().css({'padding-left':'10px'});
        //buscamos las columnas que deceamos que sean las mas angostas
        $(`#${idtabla}`).find('.col_sm').css('width','1px');
        $(`#${idtabla}`).find('.resp').css('width','150px');  
        $(`#${idtabla}`).find('.flex').css('display','flex');   
        $('[data-toggle="tooltip"]').tooltip();
        
    }
    
    
    //ESTILOS DE TABLA
    
    var lenguajeTabla = {
        "lengthMenu": 'Mostrar <select class="form-control input-sm">'+
                    '<option value="5">5</option>'+
                    '<option value="10">10</option>'+
                    '<option value="20">20</option>'+
                    '<option value="30">30</option>'+
                    '<option value="40">40</option>'+
                    '<option value="-1">Todos</option>'+
                    '</select> registros',
        "search": "Buscar:",
        "searchPlaceholder": "Ingrese un criterio de busqueda",
        "zeroRecords": "No se encontraron registros coincidentes",
        "infoEmpty": "No hay registros para mostrar",
        "infoFiltered": " - filtrado de MAX registros",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        }
    };
    



