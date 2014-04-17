var Mastermind = function() {
    var AnalyzeRow = function(values) {
            var pattern_temp = guesses[guesses.length - 1].slice(0),
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
        GeneratePattern = function() {
            var pattern = [];

            for(var i = 0; i < 5; i++) {
                pattern[i] = GetRandomColorInt().toString();
            }

            return pattern;
        },
        GetRandomColor = function() {
            return colors[GetRandomColorInt()];
        },
        GetRandomColorInt = function() {
            return Math.floor(Math.random() * 8);
        },
        guess,
        guesses = [ [ 0, 1, 2, 3, 4 ] ],
        Init = function() {
            InitDropdown();
            InitGuess();
            InitPossibleAnswers();
            current_try = 1;
            RenderGuess();

            status = $('.status');
            status.text('Solver initialized successfully...');
        },
        InitDropdown = function() {
            templates.dropdown = Hogan.compile(templates.dropdown);
            dropdown = templates.dropdown.render({ results: results, results_options: results_options });
        },
        InitGuess = function() {
            guess = Hogan.compile(templates.guess).render({});

            $('body').on('click', 'input.submit', function(event) {
                var row = $('tbody tr').last(),
                    results = {
                        reds: parseInt(row.find('select.results.red option:selected').val()),
                        whites: parseInt(row.find('select.results.white option:selected').val())
                    };

                possible_answers = possible_answers.filter(function(element, index) {
                    var analysis = AnalyzeRow(element.split("").map(function(element) { return parseInt(element); }));

                    return analysis.reds == results.reds && analysis.whites == results.whites;
                });

                status.text(possible_answers.length + " possible answers");
                var index = Math.floor(Math.random() * (possible_answers.length - 1));
                guesses.push(possible_answers[index].split("").map(function(element) { return parseInt(element); }));

                RenderGuess();
            });
        },
        InitPossibleAnswers = function() {
            for(var i = 0; i < 32768; i++) {
                var possible_answer = ("0000"+i.toString(8)).slice(-5);

                possible_answers.push(possible_answer);
            }
        },
        possible_answers = [],
        RenderGuess = function() {
            table_body = $('tbody');
            table_body.append(guess);

            var row = $('tr:last-child');
            row.find('td').each(function(index) {
                var color = colors[guesses[guesses.length - 1][index]];
                $(this).addClass(color);
            });

            row.append($('<td />').text('Analysis:'));

            row.append(dropdown);
        },
        results = [ 'red', 'white' ],
        results_options = [ 0, 1, 2, 3, 4, 5 ],
        status,
        table_body,
        table_cell,
        table_row,
        templates = {
            dropdown: '{{#results}}<td><select class="results {{.}}">{{#results_options}}<option>{{.}}</option>{{/results_options}}</select></td>{{/results}}',
            guess: '<tr class="guess"><td></td><td></td><td></td><td></td><td></td></tr>'
        };

    Init();
}();