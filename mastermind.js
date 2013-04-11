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
            InitTableRow();
            pattern = GenerateRowValues();
            current_try = 1;
            //RenderPattern();
            table_body = $('tbody');
            table_body.append(table_row.clone());
            status = $('.status');
            status.text('Game initialized successfully...');
        },
        InitDropdown = function() {
            dropdown = $('<nav />');

            $.each(colors, function(index, value) {
                var option = $('<a />').addClass(value);

                dropdown.append(option);
            });

            $('table').on('click', 'nav a', function(event) {
                var a = $(this),
                    cell = a.parents('td').first(),
                    color = a.attr('class'),
                    row = a.parents('tr').first(),
                    submit = row.find('input.submit');

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
        InitTableRow = function() {
            table_row = $('<tr />');

            var table_cell = $('<td />').addClass('grey').append(dropdown),
                submit_button = $('<input />')
                    .addClass('submit')
                    .attr('type', 'button')
                    .attr('disabled', true)
                    .val('Submit');

            for(var i = 0; i < 5; i++) {
                table_row.append(table_cell.clone());
            }

            table_row.append(submit_button);

            $('table').on('click', 'input.submit', function(event) {
                var row = $(this).parents('tr').first(),
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
        RenderPattern = function() {
            $('th').each(function(index) {
                $(this).addClass(pattern[index]);
            });
        },
        RenderResults = function(row, results) {
            var red_result = $('<td />').addClass('red result'),
                white_result = $('<td />').addClass('white result');

            row.find('input.submit').remove();

            if(results.reds < 5) {
                row.append($('<td />').text('Results:'));

                for(var i = 0; i < results.reds; i++) {
                    row.append(red_result.clone());
                }

                for(var i = 0; i < results.whites; i++) {
                    row.append(white_result.clone());
                }

                current_try++;

                if(current_try == 13) {
                    status.text('You lose!');
                    RenderPattern();
                } else {
                    table_body.append(table_row.clone());
                }
            } else {
                row.append($('<td />').text('YOU WON!'));
                //status.text('You won!');
                RenderPattern();
            }
        },
        status,
        table_body,
        table_row;

    Init();
}();