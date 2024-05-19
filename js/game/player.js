function calcPlayer(){
    calcData()
    calcAutomator()
    calcGame()
}

function calcData(){
    loader(['data','offline'], n(0))
    loader(['data','devSpeed'], n(1))
    loader(['data','version'], null)
    loader(['data','versiontimes'], n(0))
}

function calcAutomator(){
    for(let i in main['resource']){
		loader(['resource',i],n(0))
        loader(['resource',i+'Unlock'], false)
        loader(['resource',i+'Unlocked'], false)
	}

    for(let i in main['action']){
        loader(['action',i+'Clicks'], n(0))
        if(main['action'][i]['cooldown']!==undefined){
            loader(['action',i+'Cooldown'], n(0))
            loader(['action',i+'Click'], false)
        }
        if(main['action'][i]['data']!==undefined){
            for(let id in main['action'][i]['data']){
                loader(['action',i,id], main['action'][i]['data'][id]())
            }
        }
    }

    for(let i in main['building']){
		loader(['building',i],n(0))
	}

    for(let i in main['craft']){
        loader(['craft',i+'Clicks'], n(0))
        if(main['craft'][i]['cooldown']!==undefined){
            loader(['craft',i+'Cooldown'], n(0))
            loader(['craft',i+'Click'], false)
        }
        if(main['craft'][i]['data']!==undefined){
            for(let id in main['craft'][i]['data']){
                loader(['craft',i,id], main['craft'][i]['data'][id]())
            }
        }
    }

    for(let i in civics['citizens']){
        loader(['citizens',i], n(0))
    }

    for(let i in civics['workshop']){
        loader(['workshop',i], false)
    }

    for(let i in settings){
        if(settings[i]['type']()=="boolean"){
            loader(['setting',i], settings[i]['boolean']())
        }
        if(settings[i]['type']()=="choose"){
            loader(['setting',i], 'default')
        }
	}

    for(let i in mainResearch['main']){
		loader(['research',i], n(0))
        loader(['research',i+'Unlock'], false)
        loader(['research',i+'Unlocked'], false)
		loader(['canMainResearch',i], false)
	}
}