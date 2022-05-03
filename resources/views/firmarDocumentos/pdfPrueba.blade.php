<!DOCTYPE html>
<html>
<head>
	<title></title>

	
     

	
</head>

<body>

		<p>xzxzx</p>	
	



    <script type="text/php">
	    if ( isset($pdf) ) {
	        $pdf->page_script('
	            $font = $fontMetrics->get_font("Arial, Helvetica, sans-serif", "normal");
	            $pdf->text(490, 820, "Página $PAGE_NUM de $PAGE_COUNT", $font, 9);
	        ');
	    }
	</script>
</body>
</html>