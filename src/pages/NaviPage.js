import {React ,useState} from 'react'
import '../index.css';
import TutorContainer from '../components/TutorContainer'
import {GoSettings} from 'react-icons/go'
import Popup from '../components/Popup';
import { SelectionButton } from '../components/SelectionButtons';
import Select from 'react-select';
import makeAnimated from "react-select/animated";
var options = require("../assets/COURSES.json");


export default function NaviPage() {

  {/*

  */}

  const [popup, isPopup] = useState(false);
  const [selects, setSelects] = useState();


  const animatedComponents = makeAnimated();
  const [selectedOptions, setSelectedOptions] = useState([]);

    const customStyle = {
        control: (base, state) => ({
            ...base,
            background: "#F2F2F2",
            borderRadius: state.isFocused ? "5px 3px 0 0" : 5,
            border: state.isFocused ? "0.2rem solid #00867D" : "transparent",
            "&:hover": {
                borderColor: state.isFocused ? "#00867D" : "#00867D",
            },
            boxShadow: state.isFocused ? null : null,
            width: 260
        }),
            menu: base => ({
            ...base,
            borderRadius: 0,
            marginTop: 0,
            background: "#F2F2F2"
            }),
            menuList: base => ({
            ...base,
            padding: 0,
            fontSize: "3rem",
            fontWeight: "700"
            }),
        option: based => ({
            ...based,
            color: '#999',
            background: "#F2F2F2",
            "&:hover": {
                background: "rgba(0,134,125, 0.4)",
                cursor: "pointer"
            },
        }),
        groupHeading: based => ({
            ...based,
            color: '#00867D',
            fontWeight: 700,
            font: 'Nunito'
        }),
        input: based => ({
            ...based,
            color: "#999",
            fontSize: "1.5rem",
            fontWeight: 700
        }),
        valueContainer: based => ({
            ...based,
            color: "#00867D",
            fontSize: "2rem",
            fontWeight: 700
        }),
        singleValue: based => ({
            ...based,
            color: "#00867D",
            fontSize: "1.5rem",
            fontWeight: 700
        })
    }


  return (
    <div className = "navi-page">
      <div className = "navi-inner">
        <div className = "search-bar">
          <input id = "search-bar" type = "text" placeholder = "Search tutor"></input>
        </div>

        <div className = "navi-page-tutor-label">
          <label> Tutor </label>
          <button onClick = {() => isPopup(true)}><GoSettings size = {25} className = "goSettings" /></button>
        </div>

        <div className = "tutor-grid">
          <TutorContainer></TutorContainer>
          <TutorContainer></TutorContainer>
        </div>

        <Popup trigger = {popup} setTrigger = {isPopup}>
          <SelectionButton></SelectionButton>
          <p id = "select-label"> Find by course </p>
                <div className = "course-selection">
                    <Select multi
                        components = {animatedComponents}
                        options = {options}
                        onChange = {(item) => setSelectedOptions(item)}
                        isClearable = {true}
                        isSearchable = {true}
                        isDisabled = {false}
                        isLoading = {false}
                        closeMenuOnSelect = {false}
                        styles = {customStyle}
                        placeholder = {<div className = "course-select"> <label>Choose a course </label> </div>}
                    >
                    </Select>
                </div>
        </Popup>
      </div>


    </div>
  )
}
