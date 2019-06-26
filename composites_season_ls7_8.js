// Estado do Rio
Map.setCenter(-42.56, -22.37, 8); 
var roi = ee.FeatureCollection ('users/paulodomingos/Limite_Rio');
//var roi = ee.Geometry.Point(-41.7291, -21.6867);


// Quinquênio
var anos = [2013, 2014, 2015, 2016, 2017];


// Arrays para cada fragmento de mês analisado
var frag_mes_um = [];
var frag_mes_dois = [];
var frag_mes_tres = [];
var frag_mes_quatro = [];
var frag_mes_cinco = [];
var frag_mes_seis = [];


// Arrays com as composições finais para cada fragmento de mês
var resultados_mes_um = [];
var resultados_mes_dois = [];
var resultados_mes_tres = [];
var resultados_mes_quatro = [];
var resultados_mes_cinco = [];
var resultados_mes_seis = [];

// Função para calcular o NDVI, NDWI e NDBI - LANDSAT 7
var calc_idx_ls7 = function(image) {
  var i_ndvi = image.normalizedDifference(['B4','B3']).rename('NDVI');
  var i_ndwi =  image.normalizedDifference(['B2','B4']).rename('NDWI');
  var i_ndbi =  image.normalizedDifference(['B5','B4']).rename('NDBI');
  var is_newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi]);
  return is_newImage;
};

// Função para calcular o NDVI, NDWI e NDBI - LANDSAT 8
var calc_idx_ls8 = function(image) {
  var i_ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
  var i_ndwi =  image.normalizedDifference(['B3','B5']).rename('NDWI');
  var i_ndbi =  image.normalizedDifference(['B6','B5']).rename('NDBI');
  var is_newImage = image.addBands([i_ndvi, i_ndwi, i_ndbi]);
  return is_newImage;
};


// Função para calcular a máscara de nuvens // Modificar/excluir
var noclouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  var mask = scored.select(['cloud']).lte(20);
  var masked = image.updateMask(mask);
  return masked;
};


// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 1 )
var filterImgMesUm = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-01-01', anos.toString() + '-02-28')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
    
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-01-01', anos.toString() + '-02-28')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_um.push(ic_median);
};


// Função para filtrar e fazer as composições anuais para o segundo período de dois meses ( Mês 2 )
var filterImgMesDois = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-03-01', anos.toString() + '-04-30')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
   // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
   
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-03-01', anos.toString() + '-04-30')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_dois.push(ic_median);
};


// Função para filtrar e fazer as composições anuais para o terceiro período de dois meses ( Mês 3 )
var filterImgMesTres = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-05-01', anos.toString() + '-06-30')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
   
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-05-01', anos.toString() + '-06-30')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_tres.push(ic_median);
};


// Função para filtrar e fazer as composições anuais para o quarto período de dois meses ( Mês 4 )
var filterImgMesQuatro = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-07-01', anos.toString() + '-08-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
   
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-07-01', anos.toString() + '-08-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_quatro.push(ic_median);
};


// Função para filtrar e fazer as composições anuais para o quinto período de dois meses ( Mês 5 )
var filterImgMesCinco = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-09-01', anos.toString() + '-10-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
   
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-09-01', anos.toString() + '-10-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_cinco.push(ic_median);
};



// Função para filtrar e fazer as composições anuais para o sexto período de dois meses ( Mês 6 )
var filterImgMesSeis = function(anos) {
    
    // ImageCollection Landsat8
    var ic_ls8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-11-01', anos.toString() + '-12-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls8);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
   // var ic_roi_noclouds_ls8 = ic_ls8.map(noclouds)
    // Seleciona as bandas
    var ic_select_ls8 = ic_ls8.select(['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);
   
    
     // ImageCollection Landsat7
    var ic_ls7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
     .filterBounds(roi)
     .filterDate(anos.toString() + '-11-01', anos.toString() + '-12-31')
     .sort('system:time_start', true)
     .map(calc_idx_ls7);
     //.sort('CLOUD_COVER')
    // Gera as máscaras de nuvem // Excluir/modificar
    //var ic_roi_noclouds_ls7 = ic_ls7.map(noclouds)
    // Seleciona as bandas e renomeia no padrão do Landsat8
    var ic_select_ls7 = ic_ls7.select(['B1', 'B2', 'B3', 'B4', 'NDVI', 'NDWI', 'NDBI'], ['B2', 'B3', 'B4', 'B5', 'NDVI', 'NDWI', 'NDBI']);


    // Junta as bandas selecionadas das duas coleções
    var ic_merge = ee.ImageCollection(ic_select_ls8.merge(ic_select_ls7));
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var ic_median = ic_merge.median()
    //Corta o Estado do Rio
    .clip(roi);
    // Adiciona o resultado ao array
   frag_mes_seis.push(ic_median);
};



// Filtra os fragmentos de mês para todos os anos.
anos.map(filterImgMesUm);
anos.map(filterImgMesDois);
anos.map(filterImgMesTres);
anos.map(filterImgMesQuatro);
anos.map(filterImgMesCinco);
anos.map(filterImgMesSeis);


// Compositions para séries quienquenais (aqui só esta sendo usado um quinquênio, apesar do código ser estruturado para 5)
// Composition ( Mês 1 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i == 10 || i == 15)
  {
    var frag_mes_um_ano_um = ee.List([frag_mes_um[i + 1],
                                      frag_mes_um[i + 2],
                                      frag_mes_um[i + 3],
                                      frag_mes_um[i + 4]]);
  } 
  else 
  {
    var frag_mes_um_ano_um = ee.List([frag_mes_um[i], 
                                      frag_mes_um[i + 1],
                                      frag_mes_um[i + 2],
                                      frag_mes_um[i + 3],
                                      frag_mes_um[i + 4]]); 
  }

  var imgCol = ee.ImageCollection(frag_mes_um_ano_um);
  var resultado = imgCol.median();
  resultados_mes_um.push(resultado);
  }

// Composition ( Mês 2 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i == 10 || i == 15)
  {
    var frag_mes_dois_ano_um = ee.List([frag_mes_dois[i + 1],
                                      frag_mes_dois[i + 2],
                                      frag_mes_dois[i + 3],
                                      frag_mes_dois[i + 4]]);
  } 
  else 
  {
    var frag_mes_dois_ano_um = ee.List([frag_mes_dois[i], 
                                      frag_mes_dois[i + 1],
                                      frag_mes_dois[i + 2],
                                      frag_mes_dois[i + 3],
                                      frag_mes_dois[i + 4]]); 
  }
  var imgCol = ee.ImageCollection(frag_mes_dois_ano_um);
  var resultado = imgCol.median();
  resultados_mes_dois.push(resultado);
}

// Composition ( Mês 3 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i == 15 || i == 20)
  {
    var frag_mes_tres_ano_um = ee.List([frag_mes_tres[i + 1],
                                      frag_mes_tres[i + 2],
                                      frag_mes_tres[i + 3],
                                      frag_mes_tres[i + 4]]);
  } 
  else 
  {
    var frag_mes_tres_ano_um = ee.List([frag_mes_tres[i], 
                                      frag_mes_tres[i + 1],
                                      frag_mes_tres[i + 2],
                                      frag_mes_tres[i + 3],
                                      frag_mes_tres[i + 4]]); 
  }
  var imgCol = ee.ImageCollection(frag_mes_tres_ano_um);
  var resultado = imgCol.median();
  resultados_mes_tres.push(resultado);
}

// Composition ( Mês 4 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i == 15 || i == 20)
  {
    var frag_mes_quatro_ano_um = ee.List([frag_mes_quatro[i + 1],
                                      frag_mes_quatro[i + 2],
                                      frag_mes_quatro[i + 3],
                                      frag_mes_quatro[i + 4]]);
  } 
  else 
  {
    var frag_mes_quatro_ano_um = ee.List([frag_mes_quatro[i], 
                                      frag_mes_quatro[i + 1],
                                      frag_mes_quatro[i + 2],
                                      frag_mes_quatro[i + 3],
                                      frag_mes_quatro[i + 4]]); 
  }
  var imgCol = ee.ImageCollection(frag_mes_quatro_ano_um);
  var resultado = imgCol.median();
  resultados_mes_quatro.push(resultado);
}

// Composition ( Mês 5 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i === 0)
  {
    var frag_mes_cinco_ano_um = ee.List([frag_mes_cinco[i + 1],
                                      frag_mes_cinco[i + 2],
                                      frag_mes_cinco[i + 3],
                                      frag_mes_cinco[i + 4]]);
  } 
  else 
  {
    var frag_mes_cinco_ano_um = ee.List([frag_mes_cinco[i], 
                                      frag_mes_cinco[i + 1],
                                      frag_mes_cinco[i + 2],
                                      frag_mes_cinco[i + 3],
                                      frag_mes_cinco[i + 4]]); 
  }
  var imgCol = ee.ImageCollection(frag_mes_cinco_ano_um);
  var resultado = imgCol.median();
  resultados_mes_cinco.push(resultado);
}

// Composition ( Mês 6 )
for (var i = 0; i <= 20; i+=5) 
{
  if(i === 0 || i == 5)
  {
    var frag_mes_seis_ano_um = ee.List([frag_mes_seis[i + 2],
                                      frag_mes_seis[i + 3],
                                      frag_mes_seis[i + 4]]);
  } 
  else 
  {
    var frag_mes_seis_ano_um = ee.List([frag_mes_seis[i], 
                                      frag_mes_seis[i + 1],
                                      frag_mes_seis[i + 2],
                                      frag_mes_seis[i + 3],
                                      frag_mes_seis[i + 4]]); 
  }
  var imgCol = ee.ImageCollection(frag_mes_seis_ano_um);
  var resultado = imgCol.median();
  resultados_mes_seis.push(resultado);
}

print(resultados_mes_um[0]); 
// Visual
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};
var visParams_ts = {bands: ['NDVI'], min: -1, max: 1};

Map.addLayer(resultados_mes_seis[0].select('B4', 'B3', 'B2'), visParams, 'comp');

Map.addLayer(resultados_mes_um[0].select('NDVI'), visParams_ts, 'Bimestre 1');
Map.addLayer(resultados_mes_dois[0].select('NDVI'), visParams_ts, 'Bimestre 2');
Map.addLayer(resultados_mes_tres[0].select('NDVI'), visParams_ts, 'Bimestre 3');
Map.addLayer(resultados_mes_quatro[0].select('NDVI'), visParams_ts, 'Bimestre 4');
Map.addLayer(resultados_mes_cinco[0].select('NDVI'), visParams_ts, 'Bimestre 5');
Map.addLayer(resultados_mes_seis[0].select('NDVI'), visParams_ts, 'Bimestre 6');


//Mudar mascara de nuvem
//fazer padrão de gráfico pros pontos
//var lista = ee.List([])