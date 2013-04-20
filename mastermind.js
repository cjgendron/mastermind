var Mastermind = function() {
    var AnalyzeRow = function(values) {
            var pattern_temp = pattern.slice(0),
                results = { reds: 0, whites: 0 };

            var i = 0;
            while(i < values.length) {
                if(pattern_temp[i] == values[i]) {
                    pattern_temp.splice(i, 1);
                    values.splice(i, 1);
                    results.reds++;
                } else {
                    i++;
                }
            }

            while(values.length) {
                var index = pattern_temp.indexOf(values.pop());

                if(index > -1) {
                    results.whites++;
                    pattern_temp.splice(index, 1);
                }
            }

            return results;
        },
        colors = [ 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white', 'black' ],
        current_try,
        dropdown,
        GenerateRowValues = function() {
            var row_values = [];

            for(var i = 0; i < 5; i++) {
                row_values[i] = GetRandomColor();
            }

            return row_values;
        },
        GetRandomColor = function() {
            return colors[Math.floor(Math.random() * 8)];
        },
        hints_remaining = 3,
        Init = function() {
            InitDropdown();
            InitHint();
            InitResults();
            InitTableRow();
            pattern = GenerateRowValues();
            current_try = 1;
            table_body = $('tbody');
            table_body.append(table_row);
            status = $('.status');
            status.text('Game initialized successfully...');
        },
        InitDropdown = function() {
            templates.dropdown = Hogan.compile(templates.dropdown);
            dropdown = templates.dropdown.render({ colors: colors });

            $('table').on('click', 'nav a', function(event) {
                var a = $(this),
                    cell = a.parents('td').first(),
                    color = a.attr('class'),
                    row = a.parents('tr').first(),
                    submit = $('input.submit');

                cell.hasClass(color) ? cell.removeClass().addClass('grey') : cell.removeClass().addClass(color);

                if(row.find('td.grey').length == 0) {
                    submit.removeAttr('disabled');
                } else {
                    submit.attr('disabled', true);
                }
            });
        },
        InitHint = function() {
            $('.hints .count').text(hints_remaining);
            $('table').on('click', 'th a', function(event) {
                if(hints_remaining) {
                    hints_remaining--;
                    $('.hints .count').text(hints_remaining);
                    $(this).addClass('disabled')
                        .parent().addClass(pattern[$.inArray(this,$('th a').get())]);

                    if(!hints_remaining) {
                        $('th a').addClass('disabled');
                    }
                }
            });
        },
        InitResults = function() {
            red_result = Hogan.compile(templates.red_result).render();
            white_result = Hogan.compile(templates.white_result).render();
        },
        InitTableRow = function() {
            table_cell = Hogan.compile(templates.table_cell).render({}, { dropdown: dropdown });
            table_row = Hogan.compile(templates.table_row).render({}, { table_cell: table_cell });

            $('body').on('click', 'input.submit', function(event) {
                var row = $('tbody tr').last(),
                    cells = row.find('td'),
                    values = [];

                cells.each(function(index) {
                    var cell = $(this);
                    values[index] = cell.attr('class');
                    cell.find('nav').remove();
                });

                RenderResults(row, AnalyzeRow(values));
            });
        },
        pattern,
        red_result,
        RenderPattern = function() {
            $('th').each(function(index) {
                $(this).addClass(pattern[index]);
            });
        },
        RenderResults = function(row, results) {
            if(results.reds < 5) {
                row.append($('<td />').text('Results:'));

                for(var i = 0; i < results.reds; i++) {
                    row.append(red_result);
                }

                for(var i = 0; i < results.whites; i++) {
                    row.append(white_result);
                }

                current_try++;

                if(current_try == 13) {
                    status.text('You lose!');
                    RenderPattern();
                } else {
                    table_body.append(table_row);
                }
            } else {
                row.append($('<td />').text('YOU WON!'));
                $('input.submit').remove();
                RenderPattern();
            }
        },
        status,
        table_body,
        table_cell,
        table_row,
        templates = {
            dropdown: '<nav>{{#colors}}<a class="{{.}}" />{{/colors}}</nav>',
            red_result: '<td class="red result" />',
            table_cell: '<td class="grey">{{> dropdown}}</td>',
            table_row: '<tr>{{> table_cell}}{{> table_cell}}{{> table_cell}}{{> table_cell}}{{> table_cell}}</tr>',
            white_result: '<td class="white result" />'
        },
        white_result;

    Init();
}();