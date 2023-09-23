function getBuildingID(id){
        getByID(id+"LoadBuildingID",`
        <tooltip `+tooltipLoad(id,'TooltipLoadBuilding')+`>
            <button onclick="Build('`+id+`')">`+main['building'][id]['name']()+`(`+player['building'][id]+`)</button>
        </tooltip>
        `)
}

function Build(id){
    let canbuy = true
    let logs = '你还差'
    for(i in main['building'][id]['tooltip']['cost']){
        let res = n(main['building'][id]['tooltip']['cost'][i]()).add(1).mul(player['building'][id].add(1)).pow(player['building'][id].mul(main['building'][id]['tooltip']['costPower']()).add(1)).sub(1)
        if(n(player['resource'][i]).lt(res)){
            canbuy = false
            logs += '<br><li-hid>'+format(n(res).sub(player['resource'][i]))+colorText(i)[1]
        }
    }
    if(canbuy){
        for(i in main['building'][id]['tooltip']['cost']){
            let res = n(main['building'][id]['tooltip']['cost'][i]()).add(1).mul(player['building'][id].add(1)).pow(player['building'][id].mul(main['building'][id]['tooltip']['costPower']()).add(1)).sub(1)
            player['resource'][i] = player['resource'][i].sub(res)
        }
        player['building'][id] = player['building'][id].add(1)
    }else{
        addLog(logs,'#888')
    }
    getByID(id+"LoadBuildingID",`
    <tooltip `+tooltipLoad(id,'TooltipLoadBuilding')+`>
        <button onclick="Build('`+id+`')">`+main['building'][id]['name']()+`(`+player['building'][id]+`)</button>
    </tooltip>
    `)
}