import "./../css/Settings.css";
import {ReactElement} from "react";

type Settings_Props = 
{
  Switch_Value: boolean;
  
  Set_Switch_Value: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings: React.FC<Settings_Props> = (Props): ReactElement =>
{
  function Toggle_Switch(): void
  {
    Props.Set_Switch_Value((value) => !value);
  }

  return(
    <div className = "Settings">
			<label>Edit Mode:</label>
			<div className = {`Switch ${Props.Switch_Value? "on": "off"}` } onClick={Toggle_Switch}>
        <div className = "Switch_Knob"></div>
      </div>
    </div>
  );
}

export default Settings;