import "./../css/Description.css";
import { useRef, useEffect, useState, ReactElement } from "react";

type Description_Props = 
{
	Text: string;
	Data: Data[];
	Information_Index: number;
	Subject_Index: number;
	Topic_Index: number;
	Switch_Value: boolean;
	Edit_Text_Mode: boolean;
	Description_State: boolean;
	TextArea_Input: React.RefObject<HTMLTextAreaElement>

	Set_Menu_Mode: React.Dispatch<React.SetStateAction<string>>
	Set_Text: React.Dispatch<React.SetStateAction<string>>
	Set_Data: React.Dispatch<React.SetStateAction<Data[]>>
	Set_Edit_Text_Mode: React.Dispatch<React.SetStateAction<boolean>>
	Set_Force_Render_State: React.Dispatch<React.SetStateAction<boolean>>
	Set_Description_State: React.Dispatch<React.SetStateAction<boolean>>
	Set_Information_Index: React.Dispatch<React.SetStateAction<number>>
}

type Data = {
	Subject: string;
	Subject_Info: {
		Topic: string;
		Topic_Info: {
			Title: string;
			Descriptions: string[];
			Position: {
        x: number;
        y: number;
      };
			Branches: string[];
			}[];
	}[];
}

const Description: React.FC<Description_Props> = (Props): ReactElement =>
{
	const Div = useRef<HTMLDivElement>(null);
	const TextArea = useRef<HTMLTextAreaElement>(null);
	const TextAreas = useRef<HTMLTextAreaElement[]>([]);
	const [Class, Set_Class] = useState<string>(() => `Description_Div`);

	useEffect(() => 
		{
			if (!Props.Description_State) 
			{
				if (!Div.current) return;
				Set_Class(() => `Description_Div Unmounted`);
			}
			else 
			{
				if (!Div.current) return;
				Set_Class(() => `Description_Div Mounted`);
				Div.current.style.display = "block";
			}
	}, [Props.Description_State]);
	
	useEffect(() => 
	{
		Adjust_TextArea();
	}, [Props.Text, Props.Information_Index, Props.Switch_Value, Props.Description_State]);	

	function Display(): ReactElement[] | null
 	{
		if (!Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index]) return null;
		return Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index]
			.Descriptions.map((Description, Index) =>
			(<textarea 
				onClick={(e) =>
				{
					if (Props.Edit_Text_Mode) Edit_Text(e, Index);
				}} 
				readOnly 
				ref = {(Element) => 
				{
					if(Element) TextAreas.current[Index] = Element}
				} 
				key={Index} 
				value={`- ${Description}`} 
				className="Descriptions" />)
			)
	}

	function Adjust_TextArea(): void
	{
		TextAreas.current.forEach(TextArea => 
		{
			if (!TextArea) return;
			TextArea.style.height = 'auto';
			TextArea.style.height = `${TextArea.scrollHeight}px`;
		})

		if (!TextArea.current) return;
		TextArea.current.style.height = 'auto';
		TextArea.current.style.height = `${TextArea.current.scrollHeight}px`;
	}

	function Edit_Text(e: React.MouseEvent<HTMLTextAreaElement>, Index: number): void
	{
		const target = e.target as HTMLTextAreaElement;
		const TextArea = Props.TextArea_Input.current;
		if(!TextArea) return;

		TextArea.value = target.value.slice(2);
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Descriptions.splice(Index, 1);
		localStorage.setItem("Data", JSON.stringify(Props.Data));
		Props.Set_Text(() => TextArea.value);
		Props.Set_Data(() => Props.Data);
		Props.Set_Edit_Text_Mode(() => false);
		Props.Set_Force_Render_State((Prev) => !Prev);
	}

	function Set_Information_Index(newValue: number): number
	{
		if(newValue < 0) return Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.length - 1
		return newValue % Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.length
	}

	return (
		<div ref={Div} className={Class} onClick={() => Props.Set_Menu_Mode(() => "Description_Menu")}>
			<label className="Title">
				Order No: {Props.Information_Index.toString().padStart(2, "0")}
				<br/>
				{
					Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index] &&
					Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Title
				}
				<button className = "Display_Description" onClick={() => Props.Set_Description_State(() => false)}>
					-
				</button>
			</label>
			{Props.Switch_Value ?
				<>
					{Display()}
					<textarea ref={TextArea} readOnly value={`- ${Props.Text}`} />
				</> :
				Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Descriptions.length !== 0 ? Display() : <textarea readOnly value={"- No Description"} />
			}
			<div>
				<button onClick={() => Props.Set_Information_Index((prev) => Set_Information_Index(prev - 1))}>{"<"}</button>
				<button onClick={() => Props.Set_Information_Index((prev) => Set_Information_Index(prev + 1))}>{">"}</button>
			</div>
		</div>);
}

export default Description;