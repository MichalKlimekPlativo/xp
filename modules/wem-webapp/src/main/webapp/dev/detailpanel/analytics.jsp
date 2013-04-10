<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title></title>
  <link rel="stylesheet" href="http://cdn.oesmith.co.uk/morris-0.4.1.min.css">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
  <script src="http://cdn.oesmith.co.uk/morris-0.4.1.min.js"></script>
  <style type="text/css">
    body {
      font-family: sans-serif;
      color: #333;
      text-align: center;
    }

    .display-data {
      text-align: center;
      display: inline-block;
      /*width:100px;*/
      padding: 10px 3%;
      border-right: 1px solid #ccc;
    }

    .display-data span {
      display: block;
    }

    .value {
      font-size: 50px;
    }

    .subtitle {
      font-size: 14px;
    }

    .display-data.last {
      border: none;
    }

    h3 {
      text-align: right;
      font-weight: normal;
    }


  </style>
</head>
<body>
<h3>Visitors 01.01.2013 - 30.01.2013</h3>

<div id="analytics-chart" style="height: 200px;"></div>
<div class="display-data">
  <span class="title">Page views</span>
  <span class="value">53</span>
  <span class="subtitle">5% of total</span>
</div>
<div class="display-data">
  <span class="title">Unique views</span>
  <span class="value">30</span>
  <span class="subtitle">7% of total</span>
</div>
<div class="display-data">
  <span class="title">Avg. time on page</span>
  <span class="value">0:12:11</span>
  <span class="subtitle">7% of total</span>
</div>
<div class="display-data">
  <span class="title">Entries</span>
  <span class="value">48</span>
  <span class="subtitle">5% of total</span>
</div>
<div class="display-data">
  <span class="title">Exits</span>
  <span class="value">3</span>
  <span class="subtitle">1% of total</span>
</div>
<div class="display-data last">
  <span class="title">Escape freq</span>
  <span class="value">40%</span>
  <span class="subtitle">1% of total</span>
</div>
<script type="text/javascript">
  window.onresize = function () {
    clearGraph();
    drawGraph();
  }

  window.onload = function () {
    clearGraph();
    drawGraph();
  }

  function clearGraph() {
    document.getElementById('analytics-chart').innerHTML = '';
  }

  function drawGraph() {
    new Morris.Area({
      // ID of the element in which to draw the chart.
      element: 'analytics-chart',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: [
        { day: '2013-01-01', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-02', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-03', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-04', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-05', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-06', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-07', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-08', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-09', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-10', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-11', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-12', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-13', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-14', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-15', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-16', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-17', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-18', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-19', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-20', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-21', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-22', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-23', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-24', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-25', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-26', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-27', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-28', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-29', visitors: Math.floor((Math.random() * 100) + 1) },
        { day: '2013-01-30', visitors: Math.floor((Math.random() * 100) + 1) }
      ],
      lineWidth: 5,
      pointSize: 7,
      lineColors: ['#4294de'],
      xLabels: "day",
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      // A list of names of data record attributes that contain y-values.
      ykeys: ['visitors'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Visitors']
    });
  }

</script>

</body>
</html>