class CalcController{
    constructor() {
         
        this._audio = new Audio('click.mp3');
        //saber se ta ligado ou desligado
        this._audioOnOff = false;
        /**
         * 
         * para podermor gaurdar a ultima operacao e o ultimo numero
         * para fazer o igual conseguir recuperar quando usuario clica
         * em mais de uma vez em igual para ir por exemplo somando ou multiplicando
         * ou dividindo pelo ultimo valor definido
         */
        this._lastOperator = '';
        this._lastNumber = '';

         /**
          * a variavel operation, e onde ira guardar a operacao
          * e ela sera um array e que vai salvando assim que vai clicando
          * os numeros
          */
        this._operation = [];


        //pegando o display usando querrySelector o el apos e uma convesao para element para facilitar entender que e de um elemento
        /**
         * foi refatorado antes eu tinha colocado dentro de initialize e decidi colocar no controler, apenas tirei o let pelo this
         */
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#hora');
        this._timeEl =  document.querySelector('#data');
        //como vou usar muito o pt-BR eu crio um atributo com ele
        this._locale = 'pt-BR'

        this._currentDate;
        this.initialize();
        this.initButtonEvents();
        this.initKeyboard();
        
        
    };


    pastFromClipboard(){
        document.addEventListener('paste', e=>{
          let text =  e.clipboardData.getData('Text');
          this.displayCalc = parseFloat(text);

        });

    };

    //copiar para area de transferencia
    copyToClipBoart(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy')

        input.remove();

    };
    
    //tudo que quero que aconteca assim que aconteca quando inciai a calculadora inicia por aqui
    initialize(){
        

        /*chamei ele para ele aparecer assim que inicia a 
        pagina pois se deixar no set interval ele so aparece 
        um segundo depis */
        this.setDisplayDateTime(); 
     
        setInterval(() => {
            this.setDisplayDateTime();

        }, 1000);  

        this.setLestNumberToDisplay();

        this.pastFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });
        });
      
    };

    toggleAudio(){

        /**
         * se ele entrar false ele ira se tornar true e se entrar
         * true ele se torna false. 
         */
        this._audioOnOff = !this._audioOnOff;

    };

    playAudio(){
        if (this._audioOnOff){

            /*aqui eu digo que o audio recebe
             0 independete do tempoq ue esteja tocando
             assim fazendo que quando o usuario clicar 
             mesmo que rapido vai tocar o audio*/
            this._audio.currentTime = 0;

            this._audio.play();

        };
    };

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();
           

            switch(e.key) {
                //ac -> allclear
                case 'Escape': 
                    this.clearAll();
                    break
                //ce -> cancellEntry    
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/': 
                case '%':
                    this.addOperation(e.key)
                    break;
                case 'Enter':
                case '=':
                    //pois ai chama o metodo calcular
                    this.calc();
                    break;
                case '.':
                case ',':    
                    this.addDot('.')
                    break;  
                
                
                //--- case dos numeros --- como executarei o mesmo comando nos numeros entao o break vai la embaixo
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;   
                case 'c':
                    if(e.ctrlKey) this.copyToClipBoart();
                    break;
            
            };
        });

        
    };


    
    

    /**
     * ou seja como o querrySelector que e nativo recebe dois parametros 
     * entao irei receber os eventos que nomeei como events e a funcao
     * que nomeei como fn. 
     * 
     * porem como vou passar esses eventos em elementos no caso o btn 
     * eu irei chamar tambem um elemento que noomeei como element
     */

    addEventListenerAll(element, events, fn){
        
        /**
         * split conver string em array e define entre os parenteses o 
         * paratros de separacao que e um espaco, pois la initButtonEvents
         * eu defini o click e drag apenas separando por um espaco.
         * 
         * e passar um forEach para percorrer os elementos os eventos, 
         * ou seja o evento.
         * 
         * sobre o false abaixo, como temos dois botons por conta do SVG o 
         * botao e o texto sao elementos diferentes e oode ser que 
         * quando clicar ele envie dois dados pois o dom entende que foram 
         * dois elementos clicados
         */
        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);

        });

    };
    
    clearAll(){
        this._operation = [] //adiciona o array vazio para limpar
        this._lastNumber = ''
        this._lastOperator = ''


        this.setLestNumberToDisplay();
        


    };

    clearEntry(){
        this._operation.pop();
        this.setLestNumberToDisplay();


    };

    //Pegar o ultimo item do array para fazer a verificacao se um um numero ou nao
    getLastOperation(){

        /**
         * quando semore quiser pegar o ultimo elemento do array usamos o -1
         * 
         * 
         * length sabe q quantidade de itens do array
         * 
         * Se o ultimo for numero, pois vai gerando novas posicoes no array
         * ou seja novos index, e para isso precisamos fazer uma validacao
         * ou seja converte para string de novo e concatena e aguarde se 
         * a pessoa vai digitar outro numero.
         */
  
       

        return this._operation[this._operation.length - 1];

       

        

    };

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value;
        //selecionar o ultimo numero do array e 

    }

    isOperator(value){
        /**
         * criar um array somente com os sinais
         * e perguntarei se esta ai dentro.
         * 
         * indexof busca no array, e ele vai buscar o index do array
         * ele vai buscar de 0 ate o maximo e se nao encontrar ele retorna
         * -1
         */
        

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
            //se for maior que -1 o index vou retornar true
          

    };

    pushOperation(value){

        this._operation.push(value);


        if(this._operation.length > 3){          
            

            this.calc();

          
        };


    };


    getResult(){

        /**
         * 
         * tratar o erro ou seja se ouver algum erro por exemplo
         * ele ira tentar caso contrario ele cai no catch
         */

        try{
            return eval(this._operation.join(''));
        } catch(e){ 
            setTimeout(() =>{
                this.setError();
            }, 1);
            
            

        }

        

    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){

            let firstNumberItem = this._operation[0];

            this._operation = [firstNumberItem, this._lastOperator, this._lastNumber];
        }



        if(this._operation.length > 3){

            //retiro o ultimo elemento e guardo na variavel
            last = this._operation.pop(); 

            this._lastNumber = this.getResult();
         

        } else if(this._operation.length == 3){            

            this._lastNumber = this.getLastItem(false); //para guardar o ultimo numero passo o false
            

        }

      


        

 

        

        /**
         * o join ele funciona como o split ele converte array em string 
         * e no parenteses removemos as virgulas do array com u espaco vazio.
         * 
         * o eval e uma propriedade de window que calcula strings
         */

        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operation = [result];

        }else{

        

        /**
         * apos ter feito a soma dos dois operadores que entraram na regra do pushOpertion
         * ele ira montar um novo array com o resultado do calculo + o novo numero digitado
         */

         this._operation = [result];

         if (last) this._operation.push(last);
            
        };

       

         this.setLestNumberToDisplay();


    };

    getLastItem(isOperator = true){

        let lastItem;
          

        for(let i = this._operation.length-1; i >= 0; i--){   
            /**
             * se nao for um operador significa que achei um numero
             * e se achou um numero vou colocar na variavel.
             * 
             * a explcamacao sinal de not
             */        
            if(isOperator){

                if (this.isOperator(this._operation[i])){
                    lastItem = this._operation[i];
                    break;
                }
            } else {
                if (!this.isOperator(this._operation[i])) {
                    lastItem = this._operation[i];
                    break
                }
            }
            

        };

        if (!lastItem){

            /**
             * se o operador for igual a true ele vai pegar o ultimo operador
             * se nao usar o last number.
             *
             */

            lastItem = (isOperator) ? this._lastOperator:  this._lastNumber

        };

        return lastItem

    }


    setLestNumberToDisplay(){

        let lastNumber = this.getLastItem(false);//retorna false pq quero um numero

     

        if (!lastNumber) lastNumber =0;

        //para colocar o ultimo numero na tela basta chaamr
        this.displayCalc = lastNumber;




    };


    //para fazer a operacao no tempo
    addOperation(value){

        if(isNaN(this.getLastOperation())){
                //string
                if(this.isOperator(value)){
                    //trocar o operador pega o ultimo iten e substitui o item
                    this.setLastOperation(value);


                }else if(isNaN(value)){
                    //outra coisa
                    console.log('Outra coisa',value)

                }else{

                    this.pushOperation(value);

                    this.setLestNumberToDisplay();
                };


        } else {

            if(this.isOperator(value)){
                //adicionar o operador em outra posicao do array
                this.pushOperation(value);


            }else {

                //verificando se e um numero e adicionando o proximo numero
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLestNumberToDisplay();

            };
            
        };  
    

    };


    setError(){
        this.displayCalc = 'Error';

    };

    addDot(){

        let lestOperation = this.getLastOperation();
        /**
         * 
         * no caso usando o split para dividir os o array e depois 
         * percorrer com index of para achar se tem o ponto 
         * se tiver ele vai retornar 1
         */

        if(typeof lestOperation === 'string' && lestOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lestOperation) || !lestOperation){
            this.pushOperation('0.')
        }else{
            this.setLastOperation(lestOperation.toString()+'.')
        };

        this.setLestNumberToDisplay();
        



    }


    execBtn(value){

        this.playAudio();

        switch(value) {
            //ac -> allclear
            case 'ac': 
                this.clearAll();
                break
            //ce -> cancellEntry    
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+')
                break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'igual':
                //pois ai chama o metodo calcular
                this.calc();
                break;
            case 'ponto':
                this.addDot('.')
                break;  
            
            
            //--- case dos numeros --- como executarei o mesmo comando nos numeros entao o break vai la embaixo
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;   
                
            default:
                this.setError();
                break;
        };
    };




    initButtonEvents(){
        // o maior para o menor e o filho de button 
        /**
         * 
         * o querryseectorAll trara todos os elemntos filhos
         * e nao apenas o primeiro como no querryselector
         */
        let buttons = document.querySelectorAll('#buttons > g, #parts > g')
        
        /**
         * O event listener ele recebe dois parametros o 
         * evendo que queremos e oque ira realizar quandi
         * o evento acontecer.
         * 
         * e o forech e para percorrer para cada bortao que ele
         * encontrar na nodelist do querryslectorAll
         */
        buttons.forEach((btn, index)=>{

            /**
             * esse addEventListener eu criei para pegar varios eventos 
             * de mouse e teclado como clica e arrastar e etc
             * 
             * porque como o addEventlisterner ele so le dois parametros
             * decidi fazer isso para nao tornar o codigo muito verboso
             */
            this.addEventListenerAll(btn, 'click drag ', e=>{
                /**
                 * Para returar o btn colocamos o replace
                 */
                //como e um SVG temos que chamar assim , e colocamos o texto extraido no let                
                let textBtn = btn.className.baseVal.replace('btn-', ''); 
                
                
                //vamos enviar para o metodo execBtn para executar a acao desse botao
                this.execBtn(textBtn);
            });

            /**
             * 
             * para mudar o ponteiro do mouse quando passar e se for pra cima ou pra 
             * baixo adicionando um evento (nomeado com a letra 'e')
             */

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer'

            });
    
        });

       

    };



    setDisplayDateTime(){

           /**
         * toda vez que ele ataulizar ele vai pegar o currentdate
         * para atualizar
         */

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime =  this.currentDate.toLocaleTimeString(this._locale);

    };

    
    get displayTime(){


      return  this._timeEl.innerHTML;
    };

    set displayTime(value){

      return  this._timeEl.innerHTML = value;
    };

    get displayDate(){
        
        return this._dateEl.innerHTML;
    };
    
    set displayDate(value){
        
        return this._dateEl.innerHTML = value;
    };


    //chamar o atributo private convencionado com underline
    get displayCalc(){


        return this._displayCalcEl.innerHTML;
    };
    
    //para setar ao atributo private covencionado com um underline
    set displayCalc(value){

        if(value.toString().length > 11){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    };

    get currentDate(){
        return new Date()
    }

    set currentDate(value){
        this._dataAtual = value;
    }

    

}