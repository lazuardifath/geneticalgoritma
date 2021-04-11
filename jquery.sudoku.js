(function($) {
    var global_settings = {};
    var plugin_name = "sudoku";
    $[plugin_name] = function(element, options) {
    var defaults = {
            grid: [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],
            fooSettings: function() {}
        }

        var plugin = this;
        var table, 
            panel,
            fixed = [],
            selected = {
              row: -1,
              col: -1
            };

        plugin.settings = {}

        var $element = $(element),  
             element = element;

        var createTable = function(tablegrid) {
          var t = '<table class="sudoku">';
          var ch;
          for(var r=0; r<9; r++) {
              t = t + '<tr>';
              for(var c=0; c<9; c++) {
                ch = tablegrid[r][c];
                if(ch=='0') ch='&nbsp;'; else fixed[r + c + ''] = 1;
                t = t + '<td>' +  ch + '</td>';
              }              
              t = t + '</tr>';
          } 
          t += '</table>';
          return t;
        }

        var createPanel = function() {
          var t = '<table class="sudoku"><tr>';
          for(var r=1; r<=9; r++) t += '<td>' + r + '</td>';
          t = t + '</tr></table>';
          return t;
        }

        var Render = function(n) {
            var ch,elem;
            if(typeof n == "undefined") n = -1;
            for(var r=0; r<9; r++) {
                for(var c=0; c<9; c++) {
                  ch = plugin.settings.grid[r][c];
                  if(ch=="0") ch = "&nbsp;";
                  elem = table.find('tr:eq(' + r + ')').find('td:eq(' + c + ')');
                  elem.removeClass("ll");
                  elem.html(ch);
                  if(ch==n) elem.addClass("ll");
                }
            }
        };

        plugin.init = function() {
            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);            
            table = $(createTable(plugin.settings.grid));
            panel = $(createPanel());
            $element.html(table);
            $element.append(panel);
            table.find("td").on("click",function() {
              if(typeof fixed[selected.row + selected.col + ''] != "undefined") return false;
              if(selected.row!=-1) table.find('tr:eq(' + selected.row + ')').find('td:eq(' + selected.col + ')').removeClass("hl");
              selected.col = $(this).parent().children().index(this);
              selected.row = $(this).parent().parent().children().index(this.parentNode);
              $(this).addClass("hl");              
            });        
            panel.find("td").on("click",function() {
                var n = $(this).html();
                if(selected.row==-1) return false;
                if(fixed[selected.row + selected.col + ''] == 1) return false;
                plugin.settings.grid[selected.row][selected.col] = n;
                Render(n);
            });
        }
      
        plugin.myPublicMethod = function() {
           alert($element.html());
        }

        plugin.init();
    }

    $.fn[plugin_name] = function(options) {
        return this.each(function() {
            if (undefined == $(this).data(plugin_name)) {
                var plugin = new $[plugin_name](this, options);
                //element.data('sudoku').publicMethod(arg1, arg2, ... argn) or
                // element.data('sudoku').settings.propertyName
                $(this).data(plugin_name, plugin);
            }

        });

    }

})(jQuery);