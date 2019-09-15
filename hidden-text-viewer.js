 
var htmldoc = document.querySelectorAll('body  *');
// css properties which used to hide text. Any value equal or less than specified will be considered as suspicious
/*
anyting less than font size 3, height 3px, 
*/
var disallowed_cssproperties = [ [ "display", "none" ],
		[ "visibility", "hidden" ], [ "font-size", "3" ],
		[ "position", "absolute" ], [ "opacity", "0" ], [ "height", "3" ],
		[ "width", "3" ], [ "max-height", "3" ], [ "max-width", "3" ] ];

var reset_cssproperties = [ [ "display", "block" ],
		[ "visibility", "visible" ], [ "font-size", "40" ],
		[ "position", "relative" ], [ "opacity", "1" ], [ "height", "auto" ],
		[ "width", "auto" ], [ "max-height", "none" ], [ "max-width", "none" ] ];

var reported_html = '';
var skip_elements = [ 'script', 'style' ];
var bool_reset_all = false;
for (i = 0; i < htmldoc.length; i++) {
	for (k = 0; k < disallowed_cssproperties.length; k++) {

		css_property = disallowed_cssproperties[k][0];
		disallowed_value = disallowed_cssproperties[k][1];

		real_value = window.getComputedStyle(htmldoc[i]).getPropertyValue(
				css_property);
		real_value_int = parseInt(real_value);
		real_value_int_style = parseInt(htmldoc[i].style
				.getPropertyValue(css_property));

		//check background  and text colors
		bg_color = window.getComputedStyle(htmldoc[i]).getPropertyValue('background-color');
		txt_color = window.getComputedStyle(htmldoc[i]).getPropertyValue('color');
		// convert all colors into the same format to avoid mistakes like white != #ffffff
		txt_color = RGBToHex(txt_color);
		bg_color = RGBToHex(bg_color);
		

		// check if element has disallowed css property
		if ((real_value == disallowed_value  ||  txt_color ==  bg_color  || (!isNaN(real_value_int)
				&& real_value_int <= disallowed_value && real_value_int_style <= disallowed_value))
				&& !skip_elements.includes(htmldoc[i].tagName.toLowerCase())) {

			for (r = 0; r < reset_cssproperties.length; r++) {
				htmldoc[i].style.border = '3px solid red';
				htmldoc[i].style.setProperty('min-height', '20px');
				htmldoc[i].style.setProperty(reset_cssproperties[r][0],
						reset_cssproperties[r][1]);
			}
			bool_reset_all = true;
					
// avoid displaying the same background color error multiple times by using !htmldoc[i].hasAttribute("data-check" ) 
					if( txt_color ==  bg_color && !htmldoc[i].hasAttribute("data-check" ) ){
htmldoc[i].setAttribute("data-check", "checked");
						reported_html += '<strong style="color:red">The Same Text and Background Colors are Detected</strong>:'+'Color <span style="display:inline-block;background-color:'+bg_color+'">'+bg_color+'</span><br/>';
htmldoc[i].style.setProperty('color', 'black');
htmldoc[i].style.setProperty('background-color', 'white');
					}

reported_html += '<strong>HTML tag: <span style="color:blue">'
					+ htmldoc[i].tagName
					+ '</span><br/>CSS property: <span style="color:red"> '
					+ css_property + ':' + real_value + '</span></strong>'
					+ '<br/><strong>Contains Text</strong><br/>'
					+ (htmldoc[i].innerText )
					+ '<br/><strong>Contains HTML</strong><br/>'
					+ encodeHTML(htmldoc[i].innerHTML ) + '<br/><br/>';
		}

	}
}

// reset all elements css
if( bool_reset_all ){
	for (i = 0; i < htmldoc.length; i++) {
if( skip_elements.includes(htmldoc[i].tagName.toLowerCase()) ){
continue;
}
htmldoc[i].style.position = 'relative';
htmldoc[i].style.top = 'auto';
htmldoc[i].style.left = 'auto';
htmldoc[i].style.bottom = 'auto';
htmldoc[i].style.right = 'auto';
htmldoc[i].style.display = 'block';
	}
}

var tab = window.open('', '_blank');
tab.document.write(reported_html); // where 'html' is a variable containing your HTML
tab.document.close(); // to finish loading the page
console.log('Finished');

 
function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}
 
function encodeHTML(str){
    return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
    });
}
