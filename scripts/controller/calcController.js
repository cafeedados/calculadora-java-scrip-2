class CalcController{
    constructor() {
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
        
    }
    
    //tudo que quero que aconteca assim que aconteca quando inciai a calculadora inicia por aqui
    initialize(){
        

        /*chamei ele para ele aparecer assim que inicia a 
        pagina pois se deixar no set interval ele so aparece 
        um segundo depis */
        this.setDisplayDateTime(); 
     
        setInterval(() => {
            this.setDisplayDateTime();

        }, 1000);  
      
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
            btn.addEventListener('click', e=>{
                /**
                 * Para returar o btn colocamos o replace
                 */
                console.log(btn.className.baseVal.replace('btn-', ''));//como e um SVG temos que chamar assim 
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
        this._displayCalcEl.innerHTML = value;
    };

    get currentDate(){
        return new Date()
    }

    set currentDate(value){
        this._dataAtual = value;
    }

    

}