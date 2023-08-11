<template>
  <div ref="chart" id="chart" style="height: 100%; width: 100%;"></div>
</template>


<script type="text/javascript">
import * as echarts from "echarts/core";
import $ from 'jquery';

export default {
  mounted () {
    var dom = document.getElementById('chart');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var option;

    myChart.showLoading();
    $.get('roughworld.geo.json', function (usaJson) {
      myChart.hideLoading();
      echarts.registerMap('TheWorld', usaJson, );
      option = {
        dataset: [
          {
            source: [['Afghanistan', 6025977.0], ['Albania', 684023.0], ['Algeria', 4393336.75], ['Angola', 3075673.21], ['Antigua and Barbuda', 11.4], ['Argentina', 86572197.88], ['Armenia', 242010.7], ['Australia', 26612822.12], ['Austria', 5649770.0], ['Azerbaijan', 3151182.0], ['Bahamas', 663.32], ['Bangladesh', 59960014.28], ['Barbados', 86.0], ['Belarus', 8403688.0], ['Belgium', 2565850.0], ['Belgium-Luxembourg', ''], ['Belize', 112007.0], ['Benin', 2203105.09], ['Bhutan', 103332.87], ['Bolivia (Plurinational State of)', 2914459.0], ['Bosnia and Herzegovina', 1944178.0], ['Botswana', 162222.58], ['Brazil', 125567855.04], ['Brunei Darussalam', 2511.31], ['Bulgaria', 8598290.0], ['Burkina Faso', 5179103.0], ['Burundi', 465598.52], ['Cabo Verde', 432.0], ['Cambodia', 12148000.0], ['Cameroon', 3744821.48], ['Canada', 65267800.0], ['Central African Republic', 163293.0], ['Chad', 2882262.08], ['Chile', 2761553.53], ['China', 618599089.74], ['China, Hong Kong SAR', 0.05], ['China, mainland', 616632968.41], ['China, Taiwan Province of', 1966121.27], ['Colombia', 4930195.07], ['Comoros', 37547.04], ['Congo', 30679.01], ['Costa Rica', 160752.0], ["C�te d'Ivoire", 2817182.0], ['Croatia', 3746320.0], ['Cuba', 525731.5], ['Cyprus', 75720.0], ['Czechia', 8126660.0], ['Czechoslovakia', ''], ["Democratic People's Republic of Korea", 4662710.34], ['Democratic Republic of the Congo', 3720552.81], ['Denmark', 9467690.0], ['Djibouti', 16.93], ['Dominica', 192.79], ['Dominican Republic', 986240.82], ['Ecuador', 2689566.27], ['Egypt', 22458421.86], ['El Salvador', 911983.75], ['Eritrea', 305332.72], ['Estonia', 1632790.0], ['Eswatini', 89704.47], ['Ethiopia', 30248749.18], ['Ethiopia PDR', ''], ['Fiji', 10574.82], ['Finland', 3415550.0], ['France', 56849840.0], ['French Guiana', ''], ['Gabon', 46763.17], ['Gambia', 107089.33], ['Georgia', 412308.87], ['Germany', 43265100.0], ['Ghana', 4596939.49], ['Greece', 3105370.0], ['Grenada', 380.81], ['Guadeloupe', ''], ['Guatemala', 2049869.2], ['Guinea', 4008358.0], ['Guinea-Bissau', 258411.0], ['Guyana', 691539.04], ['Haiti', 370000.0], ['Honduras', 753682.48], ['Hungary', 15566640.0], ['Iceland', 7287.0], ['India', 342108770.0], ['Indonesia', 79336202.24], ['Iran (Islamic Republic of)', 15627813.16], ['Iraq', 8885242.0], ['Ireland', 1892640.0], ['Israel', 246807.47], ['Italy', 16945440.0], ['Jamaica', 2018.0], ['Japan', 11685535.79], ['Jordan', 133241.0], ['Kazakhstan', 20185601.65], ['Kenya', 4881355.14], ['Kuwait', 26691.37], ['Kyrgyzstan', 1901475.37], ["Lao People's Democratic Republic", 4203100.0], ['Latvia', 3497100.0], ['Lebanon', 133537.9], ['Lesotho', 28707.23], ['Liberia', 279000.0], ['Libya', 209467.13], ['Lithuania', 6544720.0], ['Luxembourg', 146230.0], ['Madagascar', 4455177.01], ['Malawi', 4028211.5], ['Malaysia', 2424599.27], ['Maldives', 200.31], ['Mali', 10352055.1], ['Malta', 0.0], ['Mauritania', 410998.1], ['Mauritius', 778.0], ['Mexico', 36374789.68], ['Micronesia (Federated States of)', 283.17], ['Mongolia', 430317.92], ['Montenegro', 6683.0], ['Morocco', 3325700.24], ['Mozambique', 1948665.0], ['Myanmar', 28521951.02], ['Namibia', 174215.92], ['Nepal', 10935663.78], ['Netherlands', 1364440.0], ['New Caledonia', 10124.6], ['New Zealand', 1018690.79], ['Nicaragua', 905198.0], ['Niger', 5878519.56], ['Nigeria', 29207946.44], ['North Macedonia', 578835.44], ['Norway', 1311300.0], ['Oman', 183854.75], ['Pakistan', 47226053.0], ['Palestine', 55530.94], ['Panama', 529715.0], ['Papua New Guinea', 18331.14], ['Paraguay', 8433186.0], ['Peru', 5403711.47], ['Philippines', 27413962.2], ['Poland', 35031300.0], ['Portugal', 1053530.0], ['Puerto Rico', 185.8], ['Qatar', 1503.3], ['Republic of Korea', 4945349.62], ['Republic of Moldova', 1478349.0], ['R�union', ''], ['Romania', 18153430.0], ['Russian Federation', 130039197.24], ['Rwanda', 753527.24], ['Saint Lucia', ''], ['Saint Vincent and the Grenadines', 848.0], ['Sao Tome and Principe', 668.0], ['Saudi Arabia', 1181780.0], ['Senegal', 3640544.67], ['Serbia', 11472165.04], ['Serbia and Montenegro', ''], ['Sierra Leone', 1170341.52], ['Slovakia', 4580900.0], ['Slovenia', 749700.0], ['Solomon Islands', 2742.52], ['Somalia', 177639.78], ['South Africa', 18790402.91], ['South Sudan', 874410.0], ['Spain', 27320900.0], ['Sri Lanka', 5434886.5], ['Sudan', 4196079.29], ['Sudan (former)', ''], ['Suriname', 249874.0], ['Sweden', 5954500.0], ['Switzerland', 1010995.0], ['Syrian Arab Republic', 5322400.4], ['Tajikistan', 1280921.27], ['Thailand', 35528126.97], ['Timor-Leste', 127589.0], ['Togo', 1354443.19], ['Trinidad and Tobago', 5734.0], ['Tunisia', 1564867.25], ['T�rkiye', 37184688.0], ['Turkmenistan', 1599474.13], ['Uganda', 5190000.0], ['Ukraine', 64343120.16], ['United Arab Emirates', 26405.0], ['United Kingdom of Great Britain and Northern Ireland', 18961989.0], ['United Republic of Tanzania', 11300507.73], ['United States of America', 433256752.73], ['Uruguay', 3503171.67], ['USSR', ''], ['Uzbekistan', 7226439.34], ['Vanuatu', 913.02], ['Venezuela (Bolivarian Republic of)', 2396627.73], ['Viet Nam', 47325157.08], ['Yemen', 391000.0], ['Yugoslav SFR', ''], ['Zambia', 3689518.39], ['Zimbabwe', 1660855.19], ['World', 3006634496.16], ['Africa', 210540196.25], ['Eastern Africa', 70017889.37], ['Middle Africa', 13664712.76], ['Northern Africa', 36147872.53], ['Southern Africa', 19245253.11], ['Western Africa', 71464468.48], ['Americas', 788328578.99], ['Northern America', 498524552.73], ['Central America', 41797997.11], ['Caribbean', 1892092.44], ['South America', 246113936.71], ['Asia', 1454624728.86], ['Central Asia', 32193911.76], ['Eastern Asia', 640323003.41], ['Southern Asia', 487422710.9], ['South-eastern Asia', 237031199.09], ['Western Asia', 57653903.7], ['Europe', 525466509.88], ['Eastern Europe', 294321574.4], ['Northern Europe', 52685566.0], ['Southern Europe', 67607144.48], ['Western Europe', 110852225.0], ['Oceania', 27674482.18], ['Australia and New Zealand', 27631512.91], ['Melanesia', 42686.1], ['Micronesia', 283.17], ['European Union (27)', 285300420.0], ['Least Developed Countries', 235174388.69], ['Land Locked Developing Countries', 142337062.49], ['Small Island Developing States', 3414107.09], ['Low Income Food Deficit Countries', 611769215.3], ['Net Food Importing Developing Countries', 334907546.83]]
          },
          {
            transform: {
              type: 'filter',
              config: { dimension: 0, value:1},
            }
          },
        ],
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['stack']
            },
            dataView: {}
          }
        },
        visualMap: [
          { 
            type: 'continuous',
            seriesIndex: 0,
            left: 'right',
            inRange: {
              color: [
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ],
              symbolSize: [30, 100]
            },
            calculable: true,
          },
        ],
        series: [
          {
            datasetIndex: 1,
            name: 'of the world',
            type: 'map',
            roam: true,
            map: 'TheWorld',
            emphasis: {
              focus: 'self',
              label: {
                show: true
              },
            },
          },
        ]
      };

      myChart.on('click', function (event) {
        const clickon = event.data[0];
        // console.log('dataset');
        // console.log(event);
        if (clickon) {
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + clickon + ']} ({d}%)'
              },
              encode: {
                value: clickon,
                tooltip: clickon,
                visualMap: clickon
              },
            }
          });
        }
      });
      myChart.setOption(option);
    });

    if (option && typeof option === 'object') {
    myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  }
}
</script>