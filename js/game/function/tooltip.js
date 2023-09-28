var tooltipSel

function tooltipLoad(id,id2){
	return `onmouseenter='mouseLoad("`+id+`","`+id2+`")' onmouseleave='document.getElementById("tooltip").style.display = "none";window.clearInterval(tooltipSel)' onclick='document.getElementById("tooltip").style.display = "none";window.clearInterval(tooltipSel)'`
}

function mouseLoad(id,id2){
	document.getElementById("tooltip").style.display = ''
	tooltip(id,id2)
	tooltipSel = self.setInterval(function(){
		tooltip(id,id2)
	},50)
}

function tooltip(id,id2){
	if(id2=='TooltipLoadResource'){
			let bas = ''
			if(main['resource'][id]['tooltip']['base']!=undefined){
				bas = '<hr>'+main['resource'][id]['tooltip']['base']()
			}
			let res = ''
			if(main['resource'][id]['research']!=undefined){
				res += '<hr><span style="color:'+colorText('researchPoints')[0]+'">研究难度</span>: '+main['resource'][id]['research']()
			}
			let max = ''
			if(main['resource'][id]['tooltip']['max']!=undefined){
				max += "<hr>资源储存:"
				for(im in main['resource'][id]['tooltip']['max']){
					if(main['resource'][id]['tooltip']['max'][im]['number']!=undefined){
						if(!n(main['resource'][id]['tooltip']['max'][im]['number']()).eq(0)){
							max += '<br>'+main['resource'][id]['tooltip']['max'][im]['name']+":(+"+format(main['resource'][id]['tooltip']['max'][im]['number']())+')'
						}
					}
				}
				max += '<br><br>总计:<br>(+'+format(main['resource'][id]['max']())+')'
			}
			let gain = ''
			if(main['resource'][id]['tooltip']['gain']!=undefined){
				gain += "<hr>资源生产:"
				for(ig in main['resource'][id]['tooltip']['gain']){
					if(main['resource'][id]['tooltip']['gain'][ig]['number']!=undefined){
						if(!n(main['resource'][id]['tooltip']['gain'][ig]['number']()).eq(0)){
							gain += '<br>'+main['resource'][id]['tooltip']['gain'][ig]['name']+":("+format(main['resource'][id]['tooltip']['gain'][ig]['number']())+"/秒)"
						}
					}
				}
				let time = ''
				if(main['resource'][id]['max']!=undefined){
					time = '<hr>无法抵达上限'
					if(player['resource'][id].gte(main['resource'][id]['max']())){
						time = '<hr>已抵达上限'
					}else if(main['resource'][id]['gain']!=undefined){
						if(n(main['resource'][id]['gain']()).gt(0)){
							time = '<hr>抵达上限:'+formatTime(n(main['resource'][id]['max']()).sub(player['resource'][id]).div(main['resource'][id]['gain']()))
						}
					}
				}
				gain += '<br><br>总计:<br>('+format(main['resource'][id]['gain']())+'/秒)'
				gain += time
			}
			return getTooltipDoc(colorText(id)[1]+"<small>"+bas+res+max+gain+'</small>')
	}

	if(id2=='TooltipLoadAction'){
		let name = '未命名'
		if(main['action'][id]['name']!=undefined){
			name = main['action'][id]['name']()
		}
		if(main['action'][id]['tooltip']!=undefined){
			return getTooltipDoc(name+'<hr><small>'+main['action'][id]['tooltip']())
		}else{
			return getTooltipDoc('未命名')
		}
    }

	if(id2=='TooltipLoadBuilding'){
		let name = '未命名'
		let cost = ''
		let eff = ''
		if(main['building'][id]['name']!=undefined){
			name = main['building'][id]['name']()
		}
		if(main['building'][id]['tooltip']['cost']!=undefined){
			let a = ''
			for(i in main['building'][id]['tooltip']['cost']){
				let res = n(main['building'][id]['tooltip']['cost'][i]()).add(1).mul(player['building'][id].add(1)).pow(player['building'][id].mul(main['building'][id]['tooltip']['costPower']()).add(1)).sub(1)
				a = `<span><div style="width: 50px; display: table-cell">`+colorText(i)[1]+`</div><div style="width: 50px; display: table-cell">`+format(player['resource'][i])+`</div> / `+format(res)+`</span>`
				cost += '<div style="text-align: left;">'+a+'</div>'
			}
		}
		if(main['building'][id]['tooltip']['effect']['gain']!=undefined){
			eff += '<hr>'
			for(i in main['building'][id]['tooltip']['effect']['gain']){
				eff += `<div style="text-align: left;"><span><div style="width: 50px; display: table-cell">`+colorText(i)[1]+`</div>生产 +<div style="width: 70px; display: table-cell">`+format(main['building'][id]['tooltip']['effect']['gain'][i]())+`/s</div><div style="width: 110px; display: table-cell">(+`+getBuildGain(id,i)+`)</div></div>`
			}
		}
		return getTooltipDoc(name+"("+formatWhole(player['building'][id],0)+")"+'<hr><small>'+main['building'][id]['tooltip']['base']()+'<hr>'+cost+eff+'</samll>')
	}

	if(id2=='TooltipLoadResearch'){
		let cost = '<left><hr>'
		let res = Number(player['research'][id])
		for(i in mainResearch['main'][id]['cost'][res]){
			let time = ''
			if(main['resource'][i]['gain']!=undefined){
				if(n(main['resource'][i]['gain']()).gt(0)){
					time = ' | '+formatTime(n(mainResearch['main'][id]['cost'][res][i]()).sub(player['resource'][i]).div(main['resource'][i]['gain']()))
				}
			}
			cost += `
			<span>
				<span>
					<div style="width: 50px; display: table-cell">`+colorText(i)[1]+`</div>
					<div style="width: 50px; display: table-cell; color: `+(player['resource'][i].gte(mainResearch['main'][id]['cost'][res][i]()) ? `rgb(48, 86, 87);` : `red` )+`">`+format(player['resource'][i])+`</div>
				</span>
				<span style="color: rgb(48, 86, 87);"> / 
					<div style="width: 50px; display: table-cell; style="color: `+(n(main['resource'][i]['max']).gte(mainResearch['main'][id]['cost'][res][i]()) ? `` : `red` )+`"">`+format(mainResearch['main'][id]['cost'][res][i]())+`</div>
				</span>
			</span>
			`+time+`<br>`
		}
		if(player.canMainResearch[id]==true){
			if(player.research.conducted==id){
				cost = '<hr>再次点击取消研究<left>'
			}else{
				cost = player.research.conducted==undefined ? '<hr>再次点击开始研究<left>' : '<hr>再次点击切换研究<left>'
			}
		}
		if(player.research.conducted==undefined || player.research.conducted==id){
			cost += '<hr><span><div style="width: 50px; display: table-cell"><span style="color:'+colorText('researchPoints')[0]+'">研究值</span></div>'+format(researchNeeds(id))+'</div> ('+format(player.resource.researchPoints)+')</span></left>'
		}else{
			cost += '<hr><span>正在进行研究: '+mainResearch['main'][id]['name']()
		}
		if(player.research[id].gte(mainResearch['main'][id]['max']())){
			cost = '<hr>研究完成'
		}
		let effect = '<hr><left>效果( <span style="color:'+colorText('researchPoints')[0]+'">'+res+'</span>'+(player.research[id].gte(mainResearch['main'][id]['max']()) ? '' : ' + <green>1</green>')+' ):'
		for(i in mainResearch['main'][id]['effect']){
			for(ii in mainResearch['main'][id]['effect'][i]){
				if(n(i).lt(mainResearch['main'][id]['max']())){
					if(player.research[id].eq(i)){
						effect += `<br>`+(mainResearch['main'][id]['effect'][i][ii]()[1] ? `<green>(<i class="fa fa-plus"></i>)</green>` : `<yellow>(<i class="fa  fa-rotate-right"></i>)</yellow>`)+'<span style="color: rgb(48, 86, 87);">'+mainResearch['main'][id]['effect'][i][ii]()[0]+'</span>'
					}else if(player.research[id].gte(i)){
						effect += (mainResearch['main'][id]['effect'][i][ii]()[1] ? `<br><li-hid>`+mainResearch['main'][id]['effect'][i][ii]()[0] : '')
					}
				}
			}
		}
		effect += '</left>'
		let tooltip = ''
		for(i in mainResearch['main'][id]['tooltip']){
			if(player.research[id].gte(i)){
				tooltip += (tooltip==='' ? '' : '<br>')+mainResearch['main'][id]['tooltip'][i]()
			}
		}
		return getTooltipDoc(mainResearch['main'][id]['name']()+'<hr><small>'+tooltip+effect+cost+'</small>')
	}else{
		return getTooltipDoc('未命名')
	}
}