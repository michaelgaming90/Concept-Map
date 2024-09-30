import { ReactElement, useState } from "react";
import "./../css/Search_Bar.css";

type Search_Bar_Props = 
{
	Search_Bar_Div: React.RefObject<HTMLDivElement>
	Subject_Index: number;
	Topic_Index: number;
	Data: Data[];
	Set_Description_State:  React.Dispatch<React.SetStateAction<boolean>>
  Set_Information_Index: React.Dispatch<React.SetStateAction<number>>
}

type Data = 
{
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

const Search_Bar: React.FC<Search_Bar_Props> =  (Props): ReactElement =>
{
  const [Search_Items, Set_Search_Items] = useState<string[]>([]); 
	const [Search_Text, Set_Search_Text] = useState<string>(() => "");

	function Searching(e: React.ChangeEvent<HTMLInputElement>): void
	{
		const target = e.target as HTMLInputElement;
		Set_Search_Text(() => target.value);
		if(target.value === "") 
		{
			Set_Search_Items(() => []);
			return;
		}
		
		const results = Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.map(Information =>
		{
			if(!Information.Title.includes(target.value)) return undefined
			return Information.Title;
		})

		Set_Search_Items(() => results.filter(result =>
			result !== undefined))
	}

	function Search(e: React.MouseEvent<HTMLLabelElement>)
	{
		const target = e.target as HTMLLabelElement;
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.forEach((Information, Index) =>
		{
			if(Information.Title !== target.textContent) return;
			Props.Set_Information_Index(() => Index);
			Set_Search_Items(() => []);
			Set_Search_Text(() => "");
			Props.Set_Description_State(() => true);
		})
	}

	return (
  <div ref = {Props.Search_Bar_Div} className = "Search_Bar_Div">
    <input placeholder = "Search..." value = {Search_Text} onChange = {Searching}/>
		{Search_Items.map((Search_Item, Index) =>
			{
				if (Index > 2) return null;
				return (
				<label 
					key = {Index} 
					onClick = {Search}>
					{Search_Item}
				</label>)
			})
		}
  </div>)
}

export default Search_Bar;