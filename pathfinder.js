
$(function(){
    var listavisitados;
    var resultado = 0;

//////////////
//////////////
//algoritmos//
//////////////
//////////////

    function node(x,y)
    {
        this.coordx = x;
        this.coordy = y;
        this.gValor = 0;
        this.hValor = 0;
        this.pai = null;
        this.filhos = [];
    }

    node.prototype.set_filhos = function(listaFilhos) {
        for(var it = 0; it < listaFilhos.length; it++)
            {
                this.filhos[it] = listaFilhos[it];
            }
    };
                        // x,y
                        // gn
    node.prototype.setG = function(gn) {
        // this.gValor = $('.square-'+x+'-'+y).attr("data-g");
        this.gValor = gn;
    };

    node.prototype.setH = function(hn) {
        this.hValor = hn;
    };

    node.prototype.setPai = function(nodePai) {
        this.pai = nodePai;
    };

    node.prototype.getPai = function() {
        return this.pai;
    };

    node.prototype.getG = function() {
        return this.gValor;
    };

    node.prototype.getH = function() {
        return this.hValor;
    };
    node.prototype.calcula_f = function(x) {
        if(x == 1){
            return (this.gValor + this.hValor);
        }else if(x == 2){
            return this.hValor;
        } else{
            return this.gValor;
        }
    };

    node.prototype.nodeIsEqual = function(nodeToBeCompared) {
         if(this.coordx == nodeToBeCompared.coordx && this.coordy == nodeToBeCompared.coordy)
            return true;

        return false;
    };


    function acharMelhorNode(lista,x)
    {
        var n = lista[0];

        for(var it = 0; it < lista.length; it++)
            {
                if(lista[it].calcula_f(x) < n.calcula_f(x))
                {
                    n = lista[it];
                }
            }
        return n;
    }

    function filhos(pai)
    {
        var filhos = [
            new node(parseInt(pai.coordx) - parseInt(1), parseInt(pai.coordy) - parseInt(1)),
            new node(parseInt(pai.coordx) - parseInt(1), parseInt(pai.coordy) - parseInt(0)),
            new node(parseInt(pai.coordx) - parseInt(1), parseInt(pai.coordy) + parseInt(1)),
            new node(parseInt(pai.coordx) - parseInt(0), parseInt(pai.coordy) - parseInt(1)),
            new node(parseInt(pai.coordx) - parseInt(0), parseInt(pai.coordy) + parseInt(1)),
            new node(parseInt(pai.coordx) + parseInt(1), parseInt(pai.coordy) - parseInt(1)),
            new node(parseInt(pai.coordx) + parseInt(1), parseInt(pai.coordy) - parseInt(0)),
            new node(parseInt(pai.coordx) + parseInt(1), parseInt(pai.coordy) + parseInt(1)) 
        ];
        var i = 0; 
        while (i < filhos.length) {
            if(filhos[i].coordx > 14 || filhos[i].coordx < 0 || filhos[i].coordy > 14 || filhos[i].coordy < 0){
               filhos.splice(i,1);
            }else{
              i++;
            }
        }
        return filhos;
    }

    function distancia_entre_nodes(nodeIni,nodeFim)
    {
        var coordx;
        var coordy;
        coordx = nodeIni.coordx - nodeFim.coordx;
        coordy = nodeIni.coordy - nodeFim.coordy;
        coordx = coordx * coordx;
        coordy = coordy * coordy;
        return Math.sqrt(coordx + coordy);
    }

    function contem_no_na_lista(n,lista,tipoLista)
    {
        
        for(var it = 0; it < lista.length; it++)
            {
                if(n.nodeIsEqual(lista[it]))
                {
                    if(tipoLista == 'c')
                        return true; 
                    if(lista[it].calcula_f() >= n.calcula_f())
                        return true;
                }
            }
        return false;
    }

    function reconstruir_caminho(nodeGoal)
    {
        var path = [];
        var node_cp = nodeGoal;
        while(node_cp !== null)
        {
            path.push(node_cp);
            node_cp = node_cp.getPai();
        }
        for (var x = 0; x < path.length; x++) {
            i = path[x].coordx;
            j = path[x].coordy;
            $('.square-'+i+'-'+j).addClass('caminho');
        }
        return path;
    }

    function reconstruir_semicaminho(openList){
        var n;
        for(n = 0; n < openList.length; n++){
            i = openList[n].coordx;
            j = openList[n].coordy;
            $('.square-'+i+'-'+j).addClass('semi-caminho');
        }
    }

    function parede(n){
        var i = n.coordx;
        var j = n.coordy;
        if($('.square-'+i+'-'+j).hasClass('parede')){
            return 10000;
        }
        else if($('.square-'+i+'-'+j).hasClass('semi')){
            return 50;
        }
        return 0;
    }
    function paredeG(n){
        var i = n.coordx;
        var j = n.coordy;
        if($('.square-'+i+'-'+j).hasClass('parede')){
            return 10000;
        }
        return 0;
    }

    function a_estrela(iI,jI,iF,jF){

        var q = new node(iI, jI);
        var node_final = new node(iF, jF);
        q.setG(0);
        q.setH(distancia_entre_nodes(q,node_final));
        var path = [];
        var index;
        var sucessores;
        var condA;
        var condB;

        //starta a closed list
        var closedList = [];

        //starta a open list com o nó inicial
        var openList = [q];

        //enquanto a open list não está vazia
        while(openList.length != 0)
        {    

            q = openList[0];
            

            //achar o nó com menor "f"
            q = acharMelhorNode(openList,1);

            //removê-lo da lista
            index = openList.indexOf(q);
            openList.splice(index,1);

            //ppegar os filhos de q
            sucessores = filhos(q);

            for(var it = 0; it < sucessores.length; it++)
            {
                sucessores[it].setPai(q);
                if(q.nodeIsEqual(node_final))           //condição de parada
                {
                    reconstruir_semicaminho(closedList);
                    reconstruir_semicaminho(openList);
                    path = reconstruir_caminho(q);
                    for (var x = 0; x < path.length; x++) {
                        resultado = resultado + path[x].getG();
                    } 
                    $('#a_estrelaT').val(path.length - 1);
                    $('#a_estrelaC').val(resultado);
                    $('#a_estrelaQ').val(closedList.length + openList.length);
                    return path;
                }

                //h(n)
                sucessores[it].setH(distancia_entre_nodes(sucessores[it],node_final));
                //g(n)
                var valor_parede = parede(sucessores[it]);
                sucessores[it].setG(distancia_entre_nodes(sucessores[it],q) + valor_parede);


                //condições para atribuir melhor caminho
                condA = contem_no_na_lista(sucessores[it],openList,'o');

                condB = contem_no_na_lista(sucessores[it],closedList,'c');

                if(condA)     
                    continue;
                 
                if (condB)
                    continue;

                openList.push(sucessores[it]);

            }
            closedList.push(q);

        }
        return path;
    }

    function greedySearch(iI,jI,iF,jF){

        var q = new node(iI, jI);
        var node_final = new node(iF, jF);
        q.setG(0);
        q.setH(distancia_entre_nodes(q,node_final));
        var path = [];
        var index;
        var sucessores;
        var condA;
        var condB;

        //starta a closed list
        var closedList = [];

        //starta a open list com o nó inicial
        var openList = [q];

        //enquanto a open list não está vazia
        while(openList.length != 0)
        {    

            q = openList[0];
            

            //achar o nó com menor "f"
            q = acharMelhorNode(openList,2);

            //removê-lo da lista
            index = openList.indexOf(q);
            openList.splice(index,1);

            //ppegar os filhos de q
            sucessores = filhos(q);

            for(var it = 0; it < sucessores.length; it++)
            {
                sucessores[it].setPai(q);
                
                if(q.nodeIsEqual(node_final))           //condição de parada
                {
                    //nós visitados na closedList
                    reconstruir_semicaminho(openList);
                    reconstruir_semicaminho(closedList);
                    path = reconstruir_caminho(q);
                    for (var x = 0; x < path.length; x++) {
                        resultado = resultado + path[x].getG();
                    }
                    $('#gulosaT').val(path.length - 1);
                    $('#gulosaC').val(resultado);
                    $('#gulosaQ').val(closedList.length + openList.length);
                    return path;
                }

                //h(n)
                var valor_parede = parede(sucessores[it]); //RETORNA SEMI OU PAREDE -> UTILIZADO PRA DEFINIR O CUSTO
                var valor_paredeG = paredeG(sucessores[it]); //IGNORA SEMI-PAREDE -> UTILIZADO PRA ACHAR MELHOR CAMINHO
                sucessores[it].setH(distancia_entre_nodes(sucessores[it],node_final) + valor_paredeG);

                //g(n)
                sucessores[it].setG( distancia_entre_nodes(sucessores[it],q) + valor_parede);

                //condições para atribuir melhor caminho
                condA = contem_no_na_lista(sucessores[it],openList,'o');

                condB = contem_no_na_lista(sucessores[it],closedList,'c');

                if(condA)     
                    continue;
                 
                if(condB)
                    continue;

                openList.push(sucessores[it]);
            }

            closedList.push(q);

        }
        return path;
    }

    function custo_uniforme(iI,jI,iF,jF){

        var q = new node(iI, jI);
        var node_final = new node(iF, jF);
        q.setG(0);
        q.setH(0);
        var path = [];
        var index;
        var sucessores;
        var condA;
        var condB;

        //starta a closed list
        var closedList = [];

        //starta a open list com o nó inicial
        var openList = [q];

        //enquanto a open list não está vazia
        while(openList.length != 0)
        {    

            q = openList[0];
            

            //achar o nó com menor "f"
            q = acharMelhorNode(openList,3);

            //removê-lo da lista
            index = openList.indexOf(q);
            openList.splice(index,1);

            //ppegar os filhos de q
            sucessores = filhos(q);

            for(var it = 0; it < sucessores.length; it++)
            {
                sucessores[it].setPai(q);
                
                if(q.nodeIsEqual(node_final))           //condição de parada
                {
                    //nós visitados na closedList
                    reconstruir_semicaminho(openList);
                    reconstruir_semicaminho(closedList);
                    path = reconstruir_caminho(q);
                    resultado = 0;
                    for (var x = 0; x < path.length; x++) {
                        resultado = resultado + path[x].getG();
                    }
                    $('#uniformeT').val(path.length - 1);
                    $('#uniformeC').val(resultado);
                    $('#uniformeQ').val(closedList.length + openList.length);
                    return path;
                }

                //g(n)
                var valor_parede = parede(sucessores[it]);
                sucessores[it].setG( distancia_entre_nodes(sucessores[it],q) + valor_parede);

                //h(n)
                sucessores[it].setH(0);

                //condições para atribuir melhor caminho
                condA = contem_no_na_lista(sucessores[it],openList,'c');

                condB = contem_no_na_lista(sucessores[it],closedList,'c');
                
                if(condA)     
                    continue;
                 
                if (condB)
                    continue;

                openList.push(sucessores[it]);
            }
        if(!contem_no_na_lista(q,closedList,'c'))
            closedList.push(q);

        }
        return path;
    }


})