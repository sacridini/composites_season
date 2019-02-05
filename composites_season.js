// Setup
// Map.setCenter(-43.25,-22.90, 10); 
// var roi = ee.Geometry.Point(-43.25,-22.90);

var cana = ee.FeatureCollection("users/elacerda/Cana"),
    abacaxi = ee.FeatureCollection("users/elacerda/abacaxi");

// leste fluminense
Map.setCenter(-41.7291, -21.6867, 10); 
var roi = ee.Geometry.Point(-41.7291, -21.6867);

// Quinquênios
var anos = [1988, 1989, 1990, 1991, 1992,
            1993, 1994, 1995, 1996, 1997,
            1998, 1999, 2000, 2001, 2002, 
            2003, 2004, 2005, 2006, 2007,
            2008, 2009, 2010, 2011, 2012];
            
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

// Função para calcular o NDVI, NDWI e NDBI - LANDSAT 5
var calc_idx_ls5 = function(image) {
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

// Função para calcular a máscara de nuvens
var noclouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  var mask = scored.select(['cloud']).lte(20);
  var masked = image.updateMask(mask);
  return masked;
};

// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 1 )
var filterImgMesUm = function(anos) {
  // ImageCollection
  var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
    .filterBounds(roi)
    .filterDate(anos.toString() + '-01-01', anos.toString() + '-02-28')
    .sort('system:time_start', true)
    .map(calc_idx_ls5);
    //.sort('CLOUD_COVER')
  
  // Gera as máscaras de nuvem
  var ic_roi_noclouds = ic_roi.map(noclouds);
  // Gera uma composição utilizando a média de todas as imagens processadas/ano
  var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
  // Adiciona o resultado ao array
  frag_mes_um.push(i_roi_noclouds_median);
};

// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 2 )
var filterImgMesDois = function(anos) {
    // ImageCollection
    var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
      .filterBounds(roi)
      .filterDate(anos.toString() + '-03-01', anos.toString() + '-04-30')
      .sort('system:time_start', true)
      .map(calc_idx_ls5);
      //.sort('CLOUD_COVER')
  
    
    // Gera as máscaras de nuvem
    var ic_roi_noclouds = ic_roi.map(noclouds);
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
    // Adiciona o resultado ao array
    frag_mes_dois.push(i_roi_noclouds_median);
}; 


// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 3 )
var filterImgMesTres = function(anos) {
    // ImageCollection
    var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
      .filterBounds(roi)
      .filterDate(anos.toString() + '-05-01', anos.toString() + '-06-30')
      .sort('system:time_start', true)
      .map(calc_idx_ls5);
      //.sort('CLOUD_COVER')
  
    
    // Gera as máscaras de nuvem
    var ic_roi_noclouds = ic_roi.map(noclouds);
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
    // Adiciona o resultado ao array
    frag_mes_tres.push(i_roi_noclouds_median);
};

// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 4 )
var filterImgMesQuatro = function(anos) {
    // ImageCollection
    var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
      .filterBounds(roi)
      .filterDate(anos.toString() + '-07-01', anos.toString() + '-08-30')
      .sort('system:time_start', true)
      .map(calc_idx_ls5);
      //.sort('CLOUD_COVER')
  
    
    // Gera as máscaras de nuvem
    var ic_roi_noclouds = ic_roi.map(noclouds);
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
    // Adiciona o resultado ao array
    frag_mes_quatro.push(i_roi_noclouds_median);
}; 

// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 5 )
var filterImgMesCinco = function(anos) {
    // ImageCollection
    var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
      .filterBounds(roi)
      .filterDate(anos.toString() + '-09-01', anos.toString() + '-10-30')
      .sort('system:time_start', true)
      .map(calc_idx_ls5);
      //.sort('CLOUD_COVER')
  
    
    // Gera as máscaras de nuvem
    var ic_roi_noclouds = ic_roi.map(noclouds);
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
    // Adiciona o resultado ao array
    frag_mes_cinco.push(i_roi_noclouds_median);
}; 

// Função para filtrar e fazer as composições anuais para o primeiro período de dois meses ( Mês 6 )
var filterImgMesSeis = function(anos) {
    // ImageCollection
    var ic_roi = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
      .filterBounds(roi)
      .filterDate(anos.toString() + '-11-01', anos.toString() + '-12-31')
      .sort('system:time_start', true)
      .map(calc_idx_ls5);
      //.sort('CLOUD_COVER')
  
    
    // Gera as máscaras de nuvem
    var ic_roi_noclouds = ic_roi.map(noclouds);
    // Gera uma composição utilizando a média de todas as imagens processadas/ano
    var i_roi_noclouds_median = ee.Image(ic_roi_noclouds.median());
    // Adiciona o resultado ao array
    frag_mes_seis.push(i_roi_noclouds_median);
};

// Filtra os fragmentos de mês para todos os anos.
anos.map(filterImgMesUm);
anos.map(filterImgMesDois);
anos.map(filterImgMesTres);
anos.map(filterImgMesQuatro);
anos.map(filterImgMesCinco);
anos.map(filterImgMesSeis);



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


// Visual
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};
var visParams_ts = {bands: ['NDVI'], min: -1, max: 1};
Map.addLayer(resultados_mes_um[0].select('NDVI'), visParams_ts, '0');
Map.addLayer(resultados_mes_um[1].select('NDVI'), visParams_ts, '1');
Map.addLayer(resultados_mes_um[2].select('NDVI'), visParams_ts, '2');
Map.addLayer(resultados_mes_um[3].select('NDVI'), visParams_ts, '3');
Map.addLayer(resultados_mes_um[4].select('NDVI'), visParams_ts, '4');
Map.addLayer(abacaxi);
Map.centerObject(abacaxi);
// Map.addLayer(resultados_mes_cinco[4], visParams, 'image4');

// print(ui.Chart.image.series(resultados_mes_seis, cana, ee.Reducer.median(), 30));


