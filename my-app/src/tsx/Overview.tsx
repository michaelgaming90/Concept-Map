import "./../css/Overview.css";
import { useRef, useState, useEffect, ReactElement} from "react";

type Overview_Props = {
	Topic_Index: number;
	Subject_Index: number;
	Information_Index: number;
	Data: Data[];
	Switch_Value: boolean;
	Edit_Label_Mode: boolean;

	Set_Menu_Mode: React.Dispatch<React.SetStateAction<string>>;
	Set_Edit_Label_Mode: React.Dispatch<React.SetStateAction<boolean>>;
	Set_Information_Index: React.Dispatch<React.SetStateAction<number>>;
	Set_Description_State: React.Dispatch<React.SetStateAction<boolean>>;
	Set_Data: React.Dispatch<React.SetStateAction<Data[]>>;
};

type Data = {
	Subject: string;
	Subject_Info: {
		Topic: string;
		Topic_Info: {
			Title: string;
			Descriptions: string[];
			Position: Position;
			Branches: string[];
			}[];
	}[];
}

type Position = {
 x: number;
 y: number;
}

const Overview: React.FC<Overview_Props> = (Props): ReactElement =>
{
	const [Position, Set_Position] = useState<Position>({x: 0, y: 0});
	const [Rerender, Set_Rerender] = useState<boolean>(() => true);
	const Draggable_Label = useRef<HTMLLabelElement[]>([]);
	const Offset = useRef<Position>({x: 0, y: 0});

	useEffect(() =>
	{
		Set_Rerender(() => true);
	}, [Props.Topic_Index, Props.Subject_Index]);

	function Drag_Start(e: React.DragEvent<HTMLLabelElement> | React.TouchEvent<HTMLLabelElement>): void
	{
		const target = e.target as HTMLElement;
		const labelRect = target.getBoundingClientRect();
		const Client_X = "touches" in e? e.touches[0].clientX: e.clientX;
		const Client_Y = "touches" in e? e.touches[0].clientY: e.clientY;
    
		Offset.current = {
      x: Client_X - labelRect.left,
      y: Client_Y - labelRect.top,
    };

		Draggable_Label.current.forEach((Label: HTMLLabelElement, Index) =>
		{
			if(!Label) return;
			if(target.textContent === Label.textContent)
				Set_Position(() => Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position);
		})
	}

	function Dragging(e: React.DragEvent<HTMLLabelElement> | React.TouchEvent<HTMLLabelElement>): void
	{
		const target = e.target as HTMLElement;
		const Client_X = "touches" in e? e.touches[0].clientX: e.clientX;
		const Client_Y = "touches" in e? e.touches[0].clientY: e.clientY;

		if(Client_X !== 0 && Client_Y !== 0) 
		{
      Set_Position({
        x: Client_X - Offset.current.x,
        y: Client_Y - Offset.current.y,
      });

			target.style.left = `${Position.x}px`;
			target.style.top = `${Position.y}px`;
    }
	}

	function Drag_End(e: React.DragEvent<HTMLLabelElement> | React.TouchEvent<HTMLLabelElement>): void
	{
		let index = -1;
		const target = e.target as HTMLElement;
		for(let i = 0; i < Draggable_Label.current.length; i++)
		{
			if(!Draggable_Label.current[i]) continue;
			if(Draggable_Label.current[i].textContent === target.textContent) index = i;
		}
		if(index === -1) return;
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[index].Position = Position;
		localStorage.setItem("Data", JSON.stringify(Props.Data));
  };

	function Edit_Label(e: React.MouseEvent<HTMLLabelElement, MouseEvent>): void
	{
		const target = e.target as HTMLElement;
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.forEach((Information, Index) =>
		{
			if(!target.textContent) return;
			if(Information.Title !== target.textContent.slice(7) && Information.Title !== target.textContent.slice(8)) return;
			Props.Set_Description_State(() => false); 
      localStorage.setItem("Back_Up", JSON.stringify({Data: Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index], Index: Index}));
		
			Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.splice(Index, 1);
    	localStorage.setItem("Data", JSON.stringify(Props.Data));
      Props.Set_Data(() => Props.Data);
		})
	}

	function Connect_Information(): ReactElement| null
	{
		if(Draggable_Label.current.length === 0) return null;
		if(Rerender) 
		{
			Set_Rerender(() => false);
			return null;
		} 

		return (<svg> {Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.map((Information, Index) =>
		{
			return Information.Branches.map((_, i) => 
			{
				let Parent_Index = -1;
				for(let k = 0; k < Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.length; k++)
				{
					if(!Draggable_Label.current[k]) continue;
					if(Information.Branches[i] !== Draggable_Label.current[k].getAttribute("data-unique_id")) 
						continue;
					Parent_Index = k;
					break;
				}

				if(Parent_Index === -1) return null;
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
			{Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.map((Information, Index: number) =>
				(
					<label
						ref = {(Element) => {if (Element) Draggable_Label.current[Index] = Element}}
						key = {Index} 
						style={{
							left: `${Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position.x}px`,
							top: `${Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position.y}px`
						}}
						className = {`Draggable${Props.Switch_Value?" on":""}${Index === Props.Information_Index? " Glow": ""}`}
						data-unique_id = {Index.toString()}
						draggable = {Props.Switch_Value? true: false}
						onDragStart = {Props.Switch_Value? Drag_Start: () => {}} 
						onDrag = {Props.Switch_Value? Dragging: () => {}}
						onDragEnd = {Props.Switch_Value? Drag_End: () => {}}

						onTouchStart = {Props.Switch_Value? Drag_Start: () => {}}
						onTouchMove = {Props.Switch_Value? Dragging: () => {}}
						onTouchEnd = {Props.Switch_Value? Drag_End: () => {}}
						onClick = {(e) => 
						{
							Set_Position(() => Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index].Position);
							Props.Set_Information_Index(() => Index);
							Props.Set_Description_State(() => true);
							Props.Set_Menu_Mode(() => "Overview_Menu");
							if(!Props.Edit_Label_Mode) return;
							Props.Set_Edit_Label_Mode(() => false);
							Edit_Label(e);
						}}>
						Order {Index}<br/>{Information.Title}
					</label>
				)
			)	
			}
			{Connect_Information()}
		</div>);
}

export default Overview;