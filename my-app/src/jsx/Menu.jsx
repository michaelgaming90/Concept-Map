import "./../css/Menu.css";
import React, {useState, useRef} from "react";

function Menu(Props)
{
  const [Option_State, Set_Option_State] = useState(() => false);
  const [Hide_Button_Text, Set_Hide_Button_Text] = useState(() => "-");

  const Button_Div = useRef(null);
  const Name_Input = useRef(null);
  const Child_Input = useRef(null);
  const Callbacks = useRef([]);

  function Show_Option()
  {
    if(!Option_State) return null;
    return(
      <div>
        <label>Name: </label>
        <input ref = {Name_Input}/>
        <label>Ids: </label>
        <input ref = {Child_Input}/>
        <button onClick = {Add_Information}>Create Element</button>
      </div>);
  }

  function Add_Information()
  {
    let Back_Up = JSON.parse(localStorage.getItem("Back_Up"));
    if(!Back_Up) 
    {
      localStorage.setItem("Back_Up", 
      JSON.stringify(Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[0]));
      Back_Up = JSON.parse(localStorage.getItem("Back_Up"));
    }

    if(Name_Input.current.value === "") return;
    for(let i = 0; i < Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.length; i++)
    {
      if(!Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[i]) continue;
      if(Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[i].Title === Name_Input.current.value) 
        return Name_Input.current.value = "no";
    }

    const Childs = Child_Input.current.value.split(", ");
    if(Name_Input.current.value !== Back_Up.Data.Title)
    {
      Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.push({
      Title: Name_Input.current.value,
      Descriptions: [],
      Position: {x: 100, y: 100},
      Branches: Childs
      })
    }
    else
    {
      Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.splice(Back_Up.Index, 0, {
      Title: Back_Up.Data.Title,
      Descriptions: Back_Up.Data.Descriptions,
      Position: Back_Up.Data.Position,
      Branches: Childs
      })
    }

    localStorage.setItem("Data", JSON.stringify(Props.Data));
    Props.Set_Data(() => Props.Data);
    Set_Option_State((Prev) => !Prev);
    Props.Set_Force_Render_State((Prev => !Prev));
  }

  //Overview Menu
  function Edit_Element()
  {
    function Click_Event(Label)
    {
      return function()
      {
        Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.forEach((Information, Index) =>
        {
          if(!Option_State) Set_Option_State(() => true);
          if(!Name_Input.current || !Child_Input.current) return;
          if(Information.Title !==  Label.textContent.slice(6) || Information.Title !==  Label.textContent.slice(7)) return;

          Props.Set_Description_State(() => false); 
          localStorage.setItem("Back_Up", JSON.stringify({Data: Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Index], Index: Index}));
      
          Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info.splice(Index, 1);
          localStorage.setItem("Data", JSON.stringify(Props.Data));
          Props.Set_Data(() => Props.Data);
      
          Name_Input.current.value = Information.Title;
          Child_Input.current.value = Information.Branches.join(", ");

          Props.Draggable_Label.current.forEach((Label, Index) =>
          {
            if(!Label) return;
            Label.addEventListener("click", Callbacks.current[Index]);
          })
        });
      }
    }

    Props.Draggable_Label.current.forEach((Label, Index) =>
    {
      if(!Label) return;
      Callbacks.current[Index] = Click_Event(Label);
      Label.addEventListener("click", Callbacks.current[Index]);
    })
    Props.Set_Description_State(() => false);
  }

  function Hide_Menu()
  {
    if(Hide_Button_Text === "-") 
      return Button_Div.current.style.display = "none";
    return Button_Div.current.style.display = "flex";
  }

  function Rename_Option(Mode)
  {
    Props.Set_Text(() => "");
    Props.Set_Force_Render_State((Prev) => !Prev);
    if(Mode === "Topic") Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic = Name_Input.current.value;
    if(Mode === "Subject") Props.Data[Props.Subject_Index].Subject = Name_Input.current.value;
    Props.Set_Data(Props.Data);
    localStorage.setItem("Data", JSON.stringify(Props.Data));
    Name_Input.current.value = "";
  }

  function Remove_Option(Mode)
  {
    if(Props.Choosen_Option.Mode !== Mode) return;
    if(Mode === "Topic")
    {
      Props.Data[Props.Subject_Index].Subject_Info = Props.Data[Props.Subject_Index].Subject_Info.filter(Subject_Info => 
      {
        return Subject_Info.Topic !== Props.Choosen_Option.Name;
      })
      Props.Set_Data(() => Props.Data);
      localStorage.setItem("Data", JSON.stringify(Props.Data));
    }
    if(Mode === "Subject")
    {
      let Data = Props.Data.filter(Subject => 
      {
        return Subject.Subject !== Props.Choosen_Option.Name;
      })
      localStorage.setItem("Data", JSON.stringify(Data));
      Props.Set_Data(() => Data);
    }
    Props.Set_Subject_Index(() => 0);
    Props.Set_Topic_Index(() => 0);
    Props.Set_Force_Render_State((Prev) => !Prev);
  }

  function Add_Option(Mode)
  {
    if(Mode === "Topic") 
      Props.Data[Props.Subject_Index].Subject_Info.push(
      {
        Topic: Name_Input.current.value,
        Topic_Info: []
      });

    if(Mode === "Subject")
      Props.Data.push(
      {
        Subject: Name_Input.current.value,
        Subject_Info: [{
          Topic: "Sample",
          Topic_Info: []
        }]
      });

    
    Props.Set_Data(() => Props.Data);
    localStorage.setItem("Data", JSON.stringify(Props.Data));
  }

  //Description Menu
  function Change_Text(e)
	{
  	Props.Set_Text(() => Props.TextArea_Input.current.value);
	}

	function Add_Text()
	{
  	if(Props.TextArea_Input.current.value === "") return;
  	
    Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Descriptions.push(Props.TextArea_Input.current.value);
    Props.Set_Data(() => Props.Data);
		localStorage.setItem("Data", JSON.stringify(Props.Data));
		Props.Set_Text(() => Props.TextArea_Input.current.value);
  	Props.TextArea_Input.current.value = "";
	}

	function Remove_Text()
	{
  	Props.Set_Text(() => "");
	}

	function Edit_Text(e)
	{
		if(e.target.textContent === "Edit")
    {
      e.target.textContent = "Unedit";
      Props.Set_Edit_Text_Mode(() => true);
      return;
    }
    
   e.target.textContent = "Edit";
   Props.Set_Edit_Text_Mode(() => false);
	}

  //Displays Menu
  function Display_Overview_Menu()
  {
    return (
      <>
        {Props.Switch_Value &&
        <div className = "Menu_Div">
          <label> Menu
            <button onClick={() => 
              {
                Hide_Menu();
                Set_Hide_Button_Text(() => Hide_Button_Text === "-"? "+": "-");
              }}> {Hide_Button_Text}
            </button>
          </label>
          <div ref = {Button_Div} className = "Buttons">
            <button onClick = {() => Set_Option_State((Prev) => !Prev)}>+</button>
            <button onClick = {Edit_Element}>Edit Properties</button> 
            {Show_Option()}
          </div>
      </div>}
      </>);
  }

  function Display_Topic_Menu()
  {
    return (
      <div className = "Menu_Div">
        {Props.Switch_Value && 
          <>
            <label> Menu
              <button onClick={() => 
              {
                Hide_Menu();
                Set_Hide_Button_Text(() => Hide_Button_Text === "-"? "+": "-");
              }}> {Hide_Button_Text}
              </button>
            </label>
            <div ref = {Button_Div} className = "Buttons">
              <label>Name: </label>
              <input ref = {Name_Input}/>
              {Props.Menu_Mode === "Option_Menu  Topic" || Props.Menu_Mode === "Option_Menu  Subject"? 
                <>
                  <button onClick = {() => Props.Menu_Mode === "Option_Menu  Topic"? 
                    Rename_Option("Topic"): 
                    Rename_Option("Subject")}>Rename 
                    {Props.Menu_Mode === "Option_Menu  Topic"? 
                    " Topic": 
                    " Subject"}
                  </button>
                  <button onClick={() => Props.Menu_Mode === "Option_Menu  Topic"?
                    Remove_Option("Topic"):
                    Remove_Option("Subject")}>Remove
                    {Props.Menu_Mode === "Option_Menu  Topic"? 
                    " Topic": 
                    " Subject"}
                  </button>
                </>:
                <button onClick = {() => Props.Menu_Mode === "Option_Menu Add Topic"? 
                  Add_Option("Topic"):
                  Add_Option("Subject")
                }>Add 
                  {Props.Menu_Mode === "Option_Menu Add Topic"? 
                  " Topic": 
                  " Subject"}
                 </button>
              }
              </div>
          </>
        }
        </div>
      );
  }

  function Display_Description_Menu()
  {
    return(
      <>
      {Props.Switch_Value &&
        <div className = "Menu_Div">
          <label> Menu
            <button onClick={() => 
              {
                Hide_Menu();
                Set_Hide_Button_Text(() => Hide_Button_Text === "-"? "+": "-");
              }}> {Hide_Button_Text}
            </button>
          </label>
          <textarea className = "Text_Input" ref = {Props.TextArea_Input} onChange = {Change_Text} value = {Props.Text}/>
          <div ref = {Button_Div} className = "Buttons">
            <button onClick = {Add_Text}>Add</button>
            <button onClick = {Remove_Text}>Remove</button>
            <button onClick = {Edit_Text}>Edit</button>
          </div>
        </div>
      }
      </>
    )
  }

  switch(Props.Menu_Mode)
  {
    case "Overview_Menu": 
      return Display_Overview_Menu();
    case "Option_Menu ":
    case "Option_Menu  Topic":
    case "Option_Menu Add Topic":
    case "Option_Menu  Subject":
    case "Option_Menu Add Subject":
      return Display_Topic_Menu();
    case "Description_Menu":
      return Display_Description_Menu();
    default:
      return Display_Overview_Menu();
  }
}

export default Menu; 