import "./../css/Overview.css";
import React, { useRef, useState, useEffect} from "react";

function Overview(Props)
{
	let [Position, Set_Position] = useState({x: 0, y: 0});
	const[Rerender, Set_Rerender] = useState(() => true);
	const Offset = useRef({x: 0, y: 0});
	const Draggable_Label = useRef([]);

	useEffect(() =>
	{
		Set_Rerender(() => true);
	}, [Props.Topic_Index, Props.Subject_Index]);

	function Drag_Start(e)
	{
		const labelRect = e.target.getBoundingClientRect();
		const Client_X = e.touches? e.touches[0].clientX: e.clientX;
		const Client_Y = e.touches? e.touches[0].clientY: e.clientY;
    
		Offset.current = {
      x: Client_X - labelRect.left,
      y: Client_Y - labelRect.top,
    };

		Draggable_Label.current.forEach((Label, Index) =>
		{
			if(!Label) return;
			if(e.target.textContent === Label.textContent)
			{
				Position = Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position;
			}
		})
	}

	function Dragging(e)
	{
		const Client_X = e.touches? e.touches[0].clientX: e.clientX;
		const Client_Y = e.touches? e.touches[0].clientY: e.clientY;

		if(Client_X !== 0 && Client_Y !== 0) 
		{
      Set_Position({
        x: Client_X - Offset.current.x,
        y: Client_Y - Offset.current.y,
      });

			e.target.style.left = `${Position.x}px`;
			e.target.style.top = `${Position.y}px`;
    }
	}

	function Drag_End(e)
	{
		let index;
		Draggable_Label.current.forEach((Label, Index) =>
		{
			if(!Label) return;
			if(Label.textContent === e.target.textContent) index = Index;
		})
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[index].Position = Position;
		localStorage.setItem("Data", JSON.stringify(Props.Data));
  };

	function Edit_Label(e)
	{
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.forEach((Information, Index) =>
		{
			if(Information.Title !== e.target.textContent.slice(6) && Information.Title !== e.target.textContent.slice(7)) return;
			Props.Set_Description_State(() => false); 
      localStorage.setItem("Back_Up", JSON.stringify({Data: Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index], Index: Index}));
		
			Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.splice(Index, 1);
    	localStorage.setItem("Data", JSON.stringify(Props.Data));
      Props.Set_Data(() => Props.Data);
		})
	}

	function Connect_Information()
	{
		if(Draggable_Label.current.length === 0) return null;
		if(Rerender) 
		{
			Set_Rerender(() => false);
			return <svg></svg>
		}
		return (<svg> {Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.map((Information, Index) =>
		{
			return Information.Branches.map((_, i) => 
			{
				let Parent_Index;
				for(let k = 0; k < Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.length; k++)
				{
					if(!Draggable_Label.current[k]) continue;
					if(Information.Branches[i] !== Draggable_Label.current[k].getAttribute("unique_id")) 
						continue;
					Parent_Index = k;
					break;
				}

				if(!Draggable_Label.current[Parent_Index]) return null;
				if(!Draggable_Label.current[Index]) return null;
				
				const Parent_Computed_Style = window.getComputedStyle(Draggable_Label.current[Parent_Index]);
				const Child_Computed_Style = window.getComputedStyle(Draggable_Label.current[Index]);
				return <line 
						key = {`${Index}-${i}`}
						x1 = {Number(Draggable_Label.current[Index].style.left.slice(0, -2)) + (Number(Child_Computed_Style.width.slice(0, -2))*0.75)} 
						y1 = {Number(Draggable_Label.current[Index].style.top.slice(0, -2)) + (Number(Child_Computed_Style.height.slice(0, -2))*0.75)} 
						x2 = {Number(Draggable_Label.current[Parent_Index].style.left.slice(0, -2)) + (Number(Parent_Computed_Style.width.slice(0, -2))*0.75)} 
						y2 = {Number(Draggable_Label.current[Parent_Index].style.top.slice(0, -2)) + (Number(Parent_Computed_Style.height.slice(0, -2))*0.75)}
						style = {{
						stroke: 'blue',
						strokeWidth: 10
				}}/>
			})
		})
	}</svg>)
	}

	return(
		<div className = "Overview_Div">
			<label className = "Overview_Title">Overview</label>
			{Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.map((Information, Index) =>
				(
					<label
						ref = {(Element) => Draggable_Label.current[Index] = Element}
						key = {Index} 
						style={{
							left: `${Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position.x}px`,
							top: `${Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position.y}px`
						}}
						className = {`Draggable${Props.Switch_Value?" on":""}${Index === Props.Information_Index? " Glow": ""}`}
						unique_id = {Index}
						draggable = {Props.Switch_Value? true: false}
						onDragStart = {Props.Switch_Value? Drag_Start: null} 
						onDrag = {Props.Switch_Value? Dragging: null}
						onDragEnd = {Props.Switch_Value? Drag_End: null}

						onTouchStart = {Props.Switch_Value? Drag_Start: null}
						onTouchMove = {Props.Switch_Value? Dragging: null}
						onTouchEnd = {Props.Switch_Value? Drag_End: null}
						onClick = {(e) => 
						{
							Position = Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position;
							Props.Set_Information_Index(() => Index);
							Props.Set_Description_State(() => true);
							Props.Set_Menu_Mode(() => "Overview_Menu");
							if(Props.Edit_Label_Mode) 
							{
								Props.Set_Edit_Label_Mode(() => false);
								Edit_Label(e);
							}
						}}>{Props.Switch_Value? <>Id: {Index} <br/></>: <>Order: {Index} <br/></>}{Information.Title}
					</label>
				)
			)	
			}
			{Connect_Information()}
		</div>);
}

export default Overview;