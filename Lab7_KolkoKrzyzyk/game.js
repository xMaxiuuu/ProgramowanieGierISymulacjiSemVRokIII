document.addEventListener("DOMContentLoaded", onReady)

function onReady() {
    const 
        aInfoFull = document.getElementById("idFull"),
        aInfoUser = document.getElementById("idUser"),
        aInfoRoundUser = document.getElementById("idRoundUser"),
        aInfoWinner = document.getElementById("idWinner"),
        aInfoNumPlayers = document.getElementById("idNumPlayers"),
        aButtonStart = document.getElementById("idButtonStart"),
        aBoard = document.getElementById("idGameBoard");

    let ahTimer = null;

    if ([aInfoFull, aInfoUser, aInfoRoundUser, aInfoWinner, aInfoNumPlayers, aButtonStart, aBoard].some(x => null === x)) {
        return;
    }

    aInfoFull.style.display = "none"
    aInfoUser.style.display = "none"
    aInfoRoundUser.style.display = "none"
    aInfoWinner.style.display = "none"

    aInfoNumPlayers.innerHTML = "?"

    const aWidgetStart = bootstrap.Button.getOrCreateInstance(aButtonStart);

    function isStartButtonOn() {
        return aButtonStart.classList.contains("active")
    }

    function stopGame() {
        clearInterval(ahTimer)
        ahTimer = null

        hideBoard()
        aInfoFull.style.display = "none"
        aInfoUser.style.display = "none"
        aInfoRoundUser.style.display = "none"
        aInfoNumPlayers.innerHTML = "?"

        if (isStartButtonOn()) {
            aWidgetStart.toggle()
        }
    }

    aButtonStart.onclick = function () {
        if (isStartButtonOn()) {
            aInfoWinner.style.display = "none"
            ahTimer = setInterval(updateGameState, 1000)
        } else {
            stopGame()
        }
    }

    const aBoardCollapse = bootstrap.Collapse.getOrCreateInstance(aBoard, { toggle: false })

    const aCells = document.getElementsByTagName("td")

    for (const aCell of aCells) {
        aCell.onclick = (event) => {
            updateGameState(Number(event.target.dataset.cellIndex))
        }
    }

    function isBoardVisible() {
        return aBoard.classList.contains("show")
    }

    function showBoard() {
        if (!isBoardVisible()) {
            aBoardCollapse.show()
        }
    }

    function hideBoard() {
        if (isBoardVisible()) {
            aBoardCollapse.hide()
        }
    }

    function handleServerResponse(aResponse) {
        const aResponseType = typeof aResponse;
        if (("object" !== aResponseType) || (null === aResponse)) {
            return
        }

        if (null === ahTimer) {
            return
        }    

        const {
            User: astrWeAreUserX,
            NumUsers: astrNumUsers,
            Board: astrBoard,
            RoundUser: astrRoundUser,
            Winner: astrWinner // <---- ??
        } = aResponse,
            anNumUsers = Number(astrNumUsers),
            anRoundUser = Number(astrRoundUser);

        aInfoNumPlayers.innerHTML = anNumUsers

        let abShowGamePanel = false

        if ("Full" === astrWeAreUserX) {
            aInfoFull.innerHTML = "Poczekaj na kolejkę"
            aInfoFull.style.display = "inline-block"
            aInfoUser.style.display = "none"
            aInfoRoundUser.style.display = "none"
        } else {
            aInfoFull.style.display = "none"
            aInfoUser.innerHTML = astrWeAreUserX

            switch (astrWeAreUserX) {
                case "UserA":
                    aInfoUser.classList.remove("text-bg-danger")
                    aInfoUser.classList.add("text-bg-primary")
                    break
                case "UserB":
                    aInfoUser.classList.remove("text-bg-primary")
                    aInfoUser.classList.add("text-bg-danger")
                    break
                default:
                    break
            }

            aInfoUser.style.display = "inline-block"

            if (2 <= anNumUsers) {
                abShowGamePanel = true
                aInfoRoundUser.style.display = "inline-block"
            }
        }

        if(abShowGamePanel){
            showBoard()
        } else {
            hideBoard()
        }

        if ("number" === typeof anRoundUser) {
            aInfoRoundUser.innerHTML = (0 === anRoundUser) ? "UserA" : "UserB"
        } else {
            aInfoRoundUser.style.display = "none"
        }

        let anCountFields = 0;

        if(("string" === typeof astrBoard) && (0 < astrBoard.length)) {
            
            const avCellsState = astrBoard.split(","),
                n = avCellsState.length;

            if (9 === n) {   
                
                for(let i =0; i < n; ++i){
                    const anState = Number(avCellsState[i]),
                        aCell = document.getElementById("idCell" + i)

                    switch(anState){
                        default:
                        case 0:
                            aCell.classList.remove("texy-bg-danger", "text-bg-primary")
                            break
                        case 1:
                            ++anCountFields
                            aCell.classList.remove("text-bg-danger")
                            aCell.classList.add("text-bg-primary")
                                break
                        case 2:
                            ++anCountFields
                            aCell.classList.remove("text-bg-primary")
                            aCell.classList.add("text-bg-danger")
                            break
                    }
                }  
            }    
        }


        if (("UserA" == astrWeAreUserX) || ("UserB" == astrWeAreUserX)){
            if(("string" === typeof astrWinner) && (0 < astrWinner.length)) {
                stopGame()

                aInfoWinner.innerHTML = `Zwycięzca ${astrWinner}`
                aInfoWinner.style.display = "block"
            } else if (9 <= anCountFields){
                stopGame()

                aInfoWinner.innerHTML = "Spróbuj jeszcze raz"
                aInfoWinner.style.display = "blok"
            }
        }   
    }

    function onReadyStateChange() {
        if (XMLHttpRequest.DONE === this.onReadyState && 200 === this.status) {
            handleServerResponse(this.aResponse)
        }
    }

    function runXHR(astrURL, anCellIndex_Click){
        const aXHR = new window.XMLHttpRequest();
        aXHR.onreadystatechange = onReadyStateChange

        if("number" ===typeof anCellIndex_Click){
            astrURL += `?CellIndex_Click=${anCellIndex_Click}`
        }

        aXHR.open("GET", astrURL)
        aXHR.responseType = "json"
        aXHR.send()
    }

    function updateGameState(anCellIndex_Click){
        runXHR("getGameState.php", anCellIndex_Click)
    }
}



