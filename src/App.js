import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Widget, addUserMessage, chatOpened, addResponseMessage, renderCustomComponent, toggleWidget, toggleInputDisabled, addLinkSnippet, dropMessages } from 'react-chat-widget';
import { ApiAiClient } from "./ApiAi";
import './App.css';
import ReactStars from 'react-stars';
import ScrollArea from 'react-scrollbar';
import axios from 'axios';
import PubNubReact from 'pubnub-react';
import Home from './Home';
import chart_01 from './images/chart_01.png';
import chart_02 from './images/chart_02.png';
import chart_03 from './images/chart_03.png';
import chart_04 from './images/chart_04.png';
import card_01 from './images/platinum_thumb_3-4_card.png';
import card_02 from './images/manuDebitCard_thumb_3-4_card.png';
import card_03 from './images/ladiesBankingDebitCard_thumb_3-4_card.png';
import card_04 from './images/go4itDebit_thumb3-4_psb.png';
import apparel_1000 from './images/target_graph_1000/01_apparel.png';
import dining_1000 from './images/target_graph_1000/02_dining.png';
import grocery_1000 from './images/target_graph_1000/03_grocery.png';
import travel_1000 from './images/target_graph_1000/04_travel.png';
import target_1000 from './images/target_graph_1000/05_target.png';
import apparel_400 from './images/target_graph_400/01_apparel.png';
import dining_400 from './images/target_graph_400/02_dining.png';
import grocery_400 from './images/target_graph_400/03_grocery.png';
import travel_400 from './images/target_graph_400/04_travel.png';
import target_400 from './images/target_graph_400/05_target.png';
import total_spend from './images/total_spend.png';
import transactions from './images/transactions.png';
import net_earnings from './images/net_earnings.png';
import total_transfer from './images/total-transfer.png';
import ChartView from 'react-highcharts';
import Modal from 'react-modal';
import passport from './images/attach_possport_img.png';
import emirates from './images/attach_enbdid_img.png';
import Close from './images/close_icon.png'

var customStyles = {
    overlay: {
        zIndex: '9999',
        position: 'fixed',
        top: '0px',
        left: 'none',
        right: '245px',
        bottom: '0px',
        backgroundColor: 'none',
    },
    content: {
        position: 'absolute',
        top: '48.1%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        border: '1px solid rgb(204, 204, 204)',
        background: 'rgb(255, 255, 255)',
        overflow: 'none',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '290px',
        height: '266px'
    }
};

var slideIndex = 1;
const accessToken = 'c79e249b24724b369833cf0039f8227e';
// const avatar = require("./images/left-arrow.png");
let videoView = null;
let suggestionView = null;
var startTimer = false;
var link1 = "What are the benefits of the Supplementary Debit Card?";
var link2 = "Who can I issue this to?";
var link3 = "What are the card types and Rewards?";
var link4 = "What kind of limits can I set on the card?";
var card_number;
var countDown = 0;
var form_id;
var document = [];
var initialMessage;
var user;
var confirm_auth = true;
var otp = 12345;
var showSavePin = true;
var new_pin;
var showchat = true;
var text_class;
var intent;
var history = [];
var value = 12345;

class App extends Component {

    constructor(props) {
        super(props);
        initialMessage = props['message']
        user = props['user']
        this.apiAiClient = new ApiAiClient({ accessToken: accessToken });

        this.state = ({
            accNo: 12236548975,
            accType: "Savings Account",
            mobileNum: 9444567890,
            fullName: "Jhone",
            address: "1st Floor, Deira, P.O.Box 777",
            reason: "Self",
            bank: "DF",
            ifsc: "IFSC00001203",
            city: "Dubai",
            branch: "Dubai",
            amount: 100000,
            hideTrans: false,
            hideEditForm: false,
            videopath: "",
            ratingtext: "",
            name: "",
            gender: "",
            dob: "",
            nationality: "",
            pass_port: "",
            emirates_id: "",
            relationship: "",
            dateValid: false,
            formValid: false,
            formErrors: "",
            form_id: "",
            modalIsOpen: false,
            disable_confirm: false,
            live_agent: "",
        })
        this.pubnub = new PubNubReact({ publishKey: 'pub-c-5d0558bc-5ebe-422c-b026-892f69679247', subscribeKey: 'sub-c-fb83a83a-2ce1-11e8-9322-6e836ba663ef' });
        this.pubnub.init(this);
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
        this.uploads = this.uploads.bind(this);
        this.confirmAuth = this.confirmAuth.bind(this);
        this.savePin = this.savePin.bind(this);
        this.disableCardForm = this.disableCardForm.bind(this);
        this.showSlides = this.showSlides.bind(this);
        this.showrates = this.showrates.bind(this);
        this.saveForm = this.saveForm.bind(this);
        this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
        this.storeContexts = this.storeContexts.bind(this);
        this.deleteContexts = this.deleteContexts.bind(this);
        this.getContexts = this.getContexts.bind(this);
        this.splitSuggestion = this.splitSuggestion.bind(this);
        this.splitNewline = this.splitNewline.bind(this);
        this.close_modal = this.close_modal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.close_widget = this.close_widget.bind(this);
        this.conversation_continue = this.conversation_continue.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.confirmTrans = this.confirmTrans.bind(this);
        this.editForm = this.editForm.bind(this);
        this.saveTransaction = this.saveTransaction.bind(this);
        this.closeWidget = this.closeWidget.bind(this);
    }

    ratingChanged = (newRating) => {
        console.log(newRating)

        if (newRating == 0.5 || newRating == 1) {
            this.setState({
                ratingtext: "Very dissatisfied"
            })
        } else if (newRating == 1.5 || newRating == 2) {
            this.setState({
                ratingtext: "Dissatisfied"
            })
        } else if (newRating == 2.5 || newRating == 3) {
            this.setState({
                ratingtext: "Neutral"
            })
        } else if (newRating == 3.5 || newRating == 4) {
            this.setState({
                ratingtext: "Satisfied"
            })
        } else if (newRating == 4.5 || newRating == 5) {
            this.setState({
                ratingtext: "Very satisfied"
            })
        }
    }

    componentWillMount() {
        console.log(chatOpened, 'C')
        if (initialMessage != undefined) {
            this.handleNewUserMessage(initialMessage)
            toggleWidget();
            if (initialMessage == "live agent")
                addResponseMessage("Welcome to ENBD Live Agent. How can I help you?");
        }
        else this.getContexts()
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    closeWidget = () => {
        dropMessages();
        suggestionView = ({ color, handleClick }) =>
            <div className="rating">
                <div className="rating_text">
                    Rate your chat with EVA
                                    </div>
                <div className="ratingsubdiv">
                    <div className="rating_star">
                        <ReactStars
                            count={5}
                            onChange={this.ratingChanged}
                            size={40}
                            color2={'#ffd700'} />
                    </div>
                    <div className="rating_comments">Comments</div>
                    <div className="form-group">
                        <div className="col-md-7">
                            <input type="text" className="form-control" id="comments" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-5">&nbsp;</label>
                        <div id="button_div" className="col-md-7">
                            <button type="button" className="btn btn-primary" value="Done" onClick={this.close_widget}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        renderCustomComponent(suggestionView)
    }
    handleNewUserMessage = (newMessage) => {
        if (initialMessage == "live agent") {
            this.pubnub.publish({ channel: "User Request", message: newMessage }, (response) => {
            });
            this.pubnub.subscribe({ channels: ['Live Agent'], withPresence: true });
            this.pubnub.getMessage('Live Agent', (msg) => {
                let object = { text: msg.message.text, tag: msg.message.tag }
                addResponseMessage(object.tag)
                console.log(msg, "M")
            });
        }
        else {
            var rgx = new RegExp('^(|[\\s]+)$')
            var valid_message = rgx.test(newMessage)
            if (!valid_message) {
                this.apiAiClient.textRequest(newMessage).then((response) => {
                    console.log(response.result, "R")
                    // *****************Store Contexts starts Here*************************
                    var context_object = [];
                    var contexts = response.result.contexts;
                    for (let i in contexts) {
                        context_object.push(contexts[i].name)
                    }
                    if (response.result.metadata.intentId == "a88defd0-d7e2-4c1e-84ff-66491031506f" || response.result.metadata.intentId == "0f6c2dbf-e9cf-483a-88b6-b31d7dd1be01")
                        var intent_name = "sign in";
                    else
                        var intent_name = response.result.resolvedQuery;
                    if (newMessage != "welcome")
                        this.storeContexts(context_object, intent_name, user);
                    // *****************Store Contexts Ends here******************************

                    // ******************Delete Contexts starts here***************************
                    if ('endConversation' in response.result.metadata) {
                        if (response.result.metadata.endConversation == true) {
                            this.deleteContexts(user)
                        }
                    }
                    // ******************Delete Contexts Ends here***************************
                    console.log(response, "Speech")
                    var res = response.result.fulfillment.speech.replace(/Hari|Hari?|Jerome|Jerome?|Faisal|Faisal?/g, user);
                    var speech = res;
                    history.push({ request: newMessage, respone: speech })
                    console.log(history, "History")
                    var params = speech.split('https');
                    // if (speech.includes("https")) {
                    //     let split_test = speech.split("[newline]")
                    //     for (let i in split_test) {
                    //         if (split_test[i].includes("https")) {
                    //             let split_link = split_test[i].split("<div>")
                    //             // addResponseMessage(split_link[0])
                    //             let link = split_link[1].split("</div>")
                    //             let href = link[0].split("href=")
                    //             let url = href[1].split(">")
                    //             let msg = split_link[0] + url[0] + link[1]
                    //             // suggestionView = <div>
                    //             //     <p>{split_link[0]}</p>
                    //             //     <a target="_self" href={url[0]}>click</a>
                    //             //     <p>{link[1]}</p>
                    //             // </div>
                    //             addResponseMessage(msg)
                    //         }
                    //         else addResponseMessage(split_test[i]);
                    //     }


                    // } 
                    if (speech.includes(".mp4")) {

                        //method to display the response message
                        addResponseMessage("Here is the reference video for your help");
                        this.setState({
                            videopath: require("./videos/" + speech)
                        })

                        videoView = ({ color, handleClick }) =>
                            <div>
                                <video width="100%" height="100%" controls>
                                    <source src={this.state.videopath} />
                                </video>
                            </div>

                        //method to display the response custom message
                        renderCustomComponent(videoView)

                    }
                    else {
                        // Use Case 1
                        if (speech.includes("Debit Card to your loved ones")) {
                            this.splitNewline(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div className="button_text_list">
                                    <ul>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, link1)}>{link1}</a></li>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, link2)}>{link2}</a></li>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, link3)}>{link3}</a></li>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, link4)}>{link4}</a></li>
                                    </ul>
                                </div>
                            renderCustomComponent(suggestionView)
                            this.splitSuggestion(speech)
                        }
                        // Use Case 1 sub-links
                        else if (speech.includes("Debit Card products")) {
                            this.splitNewline(speech)
                            this.splitSuggestion(speech)
                        }
                        else if (speech.includes("cards that you are eligible")) {
                            let split_cards = speech.split(":")
                            var id = "myCarousel"
                            text_class = "text3"

                            addResponseMessage(split_cards[0])
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <div className="first-image">
                                        <a target="_self" href="javascript:void(0)" onClick={this.showModal.bind(this, 1)}><img id="initial" src={card_01} />
                                        </a>
                                        {/* <div className={text_class}>VISA PLATINUM</div> */}
                                    </div>

                                    <div className="slideshow-container">

                                        <div className="mySlides fade">
                                            {/* <div className="numbertext">1 / 4</div> */}
                                            <a target="_self" href="javascript:void(0)" onClick={this.showModal.bind(this, 1)}><img src={card_01} />
                                            </a>
                                            <div className="text2">VISA PLATINUM</div>
                                        </div>

                                        <div className="mySlides fade">
                                            {/* <div className="numbertext">2 / 4</div> */}
                                            <a target="_self" href="javascript:void(0)" onClick={this.showModal.bind(this, 1)}><img src={card_02} />
                                            </a>
                                            <div className="text2">MAN-U PLATINUM</div>
                                        </div>

                                        <div className="mySlides fade">
                                            {/* <div className="numbertext">3 / 4</div> */}
                                            <a target="_self" href="javascript:void(0)" onClick={this.showModal.bind(this, 1)}><img src={card_03} />
                                            </a>
                                            <div className="text2">LADIES BAKING</div>
                                        </div>
                                        <div className="mySlides fade">
                                            {/* <div className="numbertext">4 / 4</div> */}
                                            <a target="_self" href="javascript:void(0)" onClick={this.showModal.bind(this, 1)}><img src={card_04} />
                                            </a>
                                            <div className="text2">Go4it/YOUTH Go4it</div>
                                        </div>

                                        {/* <a className="prev" onClick={this.plusSlides.bind(this,-1)}>&#10094;</a>
                    <a className="next" onClick={this.plusSlides.bind(this,1)}>&#10095;</a> */}
                                    </div>
                                    <br></br>

                                    <div className="dot_position">
                                        <span className="dot" id="dot" onClick={this.currentSlide.bind(this, 1)}></span>
                                        <span className="dot" onClick={this.currentSlide.bind(this, 2)}></span>
                                        <span className="dot" onClick={this.currentSlide.bind(this, 3)}></span>
                                        <span className="dot" onClick={this.currentSlide.bind(this, 4)}></span>
                                    </div>
                                </div>

                            renderCustomComponent(suggestionView)
                            addResponseMessage(split_cards[1])
                            this.splitSuggestion(speech)
                        } else if (speech.includes("Daily and Monthly")) {
                            this.splitNewline(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div className="container_div">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped chat_table_design">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2">Card type</th>
                                                    <th colSpan="2">Max monthly limits(AED)</th>
                                                </tr>
                                                <tr>
                                                    <th>Cash</th>
                                                    <th>Purchase</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Visa Platinum</td>
                                                    <td>2500</td>
                                                    <td>2500</td>
                                                </tr>
                                                <tr>
                                                    <td>Man-U Platinum</td>
                                                    <td>2500</td>
                                                    <td>2500</td>
                                                </tr>
                                                <tr>
                                                    <td>Go4it/Youth Go4it</td>
                                                    <td>2500</td>
                                                    <td>2500</td>
                                                </tr>
                                                <tr>
                                                    <td>Ladies</td>
                                                    <td>2500</td>
                                                    <td>2500</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                            this.splitSuggestion(speech)
                        } else if (newMessage.toLowerCase() == "not interested") {
                            suggestionView = ({ color, handleClick }) =>
                                <div className="rating">
                                    <div className="rating_text">
                                        Rate your chat with EVA
                                    </div>
                                    <div className="ratingsubdiv">
                                        <div className="rating_star">
                                            <ReactStars
                                                count={5}
                                                onChange={this.ratingChanged}
                                                size={40}
                                                color2={'#ffd700'} />
                                        </div>
                                        <div className="rating_comments">Comments</div>
                                        <div className="form-group">
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" id="comments" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-5">&nbsp;</label>
                                            <div id="button_div" className="col-md-7">
                                                <button type="button" className="btn btn-primary" value="Done" onClick={this.close_widget}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                        }
                        // Use Case 2
                        else if (speech.includes('verify you first')) {
                            // let split_text = speech.split('Please')
                            // addResponseMessage(split_text[0])
                            this.handleClick('sign in')
                        }
                        else if (speech.includes("signed in!")) {
                            let split_text = speech.split("signed in!")
                            if (split_text[1].includes("remittance")) {
                                var id = "remittance_form"
                                let split = split_text[1].split("__remittance")
                                addResponseMessage(split[0])
                                suggestionView = ({ color, handleClick }) =>
                                    <div>
                                        <div className="form_top_title">Recipient details</div>
                                        <form className="well form-horizontal" id={id} name={id}>
                                            <fieldset>
                                                <div className="form-group">
                                                    <label className="col-md-5">Account Number</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="Acc_no" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Mobile Number</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="mbl_num" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Full Name</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="full_name" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Address</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="address" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">&nbsp;</label>
                                                    <div className="col-md-7">
                                                        <button type="button" className="btn btn-primary" value="Done" onClick={this.submit.bind(this, id, "Done")}>Done</button>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>

                                renderCustomComponent(suggestionView)
                            } else {
                                var id = "registration_form"
                                addResponseMessage(split_text[1])
                                suggestionView = ({ color, handleClick }) =>
                                    <div>
                                        <div className="form_top_title">Recipient details</div>
                                        <form className="well form-horizontal" id={id} name={id}>
                                            <fieldset>
                                                <div className="form-group">
                                                    <label className="col-md-5">Name</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="Name" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Gender</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="Gender" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">DOB</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="DOB" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Nationality</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="Nationality" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Passport No</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="PassportNo" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Emirates ID No</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="EmiratesId" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">Relationship</label>
                                                    <div className="col-md-7">
                                                        <input type="text" className="form-control" id="Relationship" name="relationship" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-5">&nbsp;</label>
                                                    <div className="col-md-7">
                                                        <button type="button" className="btn btn-primary" value="Done" onClick={this.submit.bind(this, id, "Done")}>Done</button>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>

                                renderCustomComponent(suggestionView)
                            }
                        }
                        else if (speech.includes("upload scanned copy")) {
                            addResponseMessage(speech);
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <script src="file_upload.js" type="text/javascript"></script>
                                    <form className="well form-horizontal" id="upload_form">
                                        <div className="form-group">
                                            {/* <label id="file" className="col-md-5">Passport :</label> */}
                                            <div className="fileupload fileupload-new" data-provides="fileupload" >
                                                <label id="file" className="col-md-7">Passport :</label>
                                                <span className="btn btn-primary btn-file" id="upload">
                                                    <span className="fileupload-new" ><img id="upload_image" src={passport} alt="" /></span>
                                                    {/* <span className="fileupload-exists"><img id="upload_image" src={emirates} alt="" /></span> */}
                                                    <input type="file" className="form-control" id="passport" accept="image/*" onChange={(event) => this.storeFiles(event, 0, 'Passport')} />
                                                </span> <span className="fileupload-preview"></span> <a href="javascript:void(0)" className="close fileupload-exists" data-dismiss="fileupload" >×</a>
                                            </div>
                                            {/* <div className="col-md-7">
                                        <input type="file" className="form-control" id="passport" accept="image/*" onChange={(event) => this.storeFiles(event, 0, 'Passport')} />
                                    </div> */}
                                        </div>
                                        <div className="form-group">
                                            {/* <label id="file" className="col-md-5">Emirates ID:</label> */}
                                            <div className="fileupload fileupload-new" data-provides="fileupload" >
                                                <label id="file" className="col-md-7">Emirates ID:</label>
                                                <span className="btn btn-primary btn-file" id="upload">
                                                    <span className="fileupload-new" ><img id="upload_image2" src={emirates} alt="" /></span>
                                                    <span className="fileupload-exists"><img src={emirates} alt="" /></span>
                                                    <input type="file" className="form-control" id="emiratesId" accept="image/*" onChange={(event) => this.storeFiles(event, 1, 'Emirates')} />
                                                </span><span className="fileupload-preview"></span><a href="javascript:void(0)" className="close fileupload-exists" data-dismiss="fileupload" >×</a>
                                            </div>
                                            {/* <div className="col-md-7">
                                        <input type="file" className="form-control" id="emiratesId" accept="image/*" onChange={(event) => this.storeFiles(event, 1, 'Emirates')} />
                                    </div> */}
                                        </div>
                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" value="Upload" id="file_upload" onClick={this.uploads}>Upload</button>
                                            <button type="button" className="btn btn-primary" value="Cancel" id="file_cancel" onClick={this.handleClick.bind(this, 'Cancel')}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)
                        }
                        // Use Case 3
                        else if (speech.includes("first and last 4 digits")) {
                            addResponseMessage(speech);
                            const regex = /^(\d{4})\d(?=\d{4})|\d(?=\d{4})/gm;
                            const str = "1234676712347624"
                            const subst = "$1X";

                            // The substituted value will be contained in the result variable
                            card_number = str.replace(regex, subst);
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <form className="well form-horizontal" id="cardNo_form">
                                        <div className="form-group">
                                            <label className="col-md-5">Card Number</label>
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" id="card_no" value={card_number} disabled="true" readOnly />
                                            </div>
                                        </div>
                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" onClick={this.disableCardForm.bind(this, 'correct')}>Correct</button>
                                            <button type="button" className="btn btn-primary" onClick={this.disableCardForm.bind(this, 'Incorrect')}>Incorrect</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("AUTH CODE")) {
                            addResponseMessage(speech);
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <form className="well form-horizontal" action="#" target="_self" id="auth_form">
                                        <div className="form-group">
                                            <label className="col-md-5">Auth Code</label>
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" id="auth_code" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" id="auth_button" onClick={this.confirmAuth.bind(this, "Confirm")}>Confirm</button>
                                            <button type="button" className="btn btn-primary" onClick={this.confirmAuth.bind(this, 'Cancel')}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("new 4 digit PIN")) {
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <form className="well form-horizontal" action="#" target="_self" id="pinChange_form">
                                        <div className="form-group">
                                            <label className="col-md-5">New Pin</label>
                                            <div className="col-md-7">
                                                <input type="password" className="form-control" id="new_pin" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-5">Confirm Pin</label>
                                            <div className="col-md-7">
                                                <input type="password" className="form-control" id="confirm_pin" />
                                            </div>
                                        </div>
                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" onClick={this.savePin.bind(this, 'Save')} id="savePin">Save</button>
                                            <button type="button" className="btn btn-primary" onClick={this.savePin.bind(this, 'Cancel')}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("debit card spend by customer ")) {
                            this.splitNewline(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <div className="container_div">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped chat_table_design">
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Avg. monthly spend</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Apparel</td>
                                                        <td>800</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dining</td>
                                                        <td>150</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Grocery</td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Travel</td>
                                                        <td>1500</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total</td>
                                                        <td>2450</td>
                                                    </tr>
                                                    <tr>
                                                        <td>To reach Target</td>
                                                        <td>500</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                            this.splitSuggestion(speech)
                        }
                        // use case 4
                        else if (speech.includes("opportunity to earn AED 1000... You just need to spend AED 1000")) {
                            let split_test = speech.split("[newline]")
                            addResponseMessage(split_test[0])
                            suggestionView = ({ color, handleClick }) =>
                                <div className="bind_images">
                                    <a className="apparel_400" target="_self" href="javascript:void(0)" onClick={this.apparel_1000.bind(this, 1)}><img src={apparel_1000} /></a>
                                    <a className="dining_400" target="_self" href="javascript:void(0)" onClick={this.dining_1000.bind(this, 2)}><img src={dining_1000} /></a>
                                    <a className="grocery_400" target="_self" href="javascript:void(0)" onClick={this.grocery_1000.bind(this, 3)}><img src={grocery_1000} /></a>
                                    <a className="travel_400" target="_self" href="javascript:void(0)" onClick={this.travel_1000.bind(this, 4)}><img src={travel_1000} /></a>
                                    <a className="target_1000" target="_self" href="javascript:void(0)" onClick={this.target_1000.bind(this, 5)}><img src={target_1000} /></a>
                                </div>
                            renderCustomComponent(suggestionView)
                            addResponseMessage(split_test[1])

                        }
                        //use case 5
                        else if (speech.includes("Summary of your performance ")) {
                            let split_test = speech.split("[newline]")
                            addResponseMessage(split_test[0])
                            suggestionView = ({ color, handleClick }) =>
                                <div className="chart_box">
                                    <div className="chart_list">
                                        <ul>
                                            <li><img src={transactions} /></li>
                                            <li><img src={net_earnings} /></li>
                                            <li><img src={total_spend} /></li>
                                        </ul>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                            addResponseMessage(split_test[1])
                        }
                        // remittance project...
                        else if (speech.includes(" counting the  travel and queue")) {
                            if (speech.includes("[suggestions]")) {
                                let split_text = speech.split("[suggestions]")
                                addResponseMessage(split_text[0])
                                suggestionView = ({ color, handleClick }) =>
                                    <div className="transaction_summary_button_design">
                                        <button type="button" className="btn btn-primary" onClick={this.showrates}>Compare rates</button>
                                    </div>
                                renderCustomComponent(suggestionView)
                                let split_options = split_text[1].split("__")
                                for (let index in split_options) {
                                    suggestionView = ({ color, handleClick }) =>
                                        <div className="button_text_list">
                                            <ul>
                                                <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, split_options[index])}>{split_options[index]}</a></li>
                                            </ul>
                                        </div>
                                    renderCustomComponent(suggestionView)
                                }
                            }
                            else {
                                addResponseMessage(speech)
                                suggestionView = ({ color, handleClick }) =>
                                    <div className="transaction_summary_button_design">
                                        <button type="button" className="btn btn-primary" onClick={this.showrates}>Compare rates</button>
                                    </div>
                                renderCustomComponent(suggestionView)
                            }
                        }
                        else if (speech.includes("IFSC code of the recipient ")) {
                            addResponseMessage(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <form className="well form-horizontal" action="#" target="_self" id="auth_form">
                                        <div className="form-group">
                                            <label className="col-md-5">IFSC Code</label>
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" id="auth_code" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" id="ifsc_button" onClick={this.confirmAuth.bind(this, 'Done')}>Done</button>
                                            <button type="button" className="btn btn-primary" id="ifsc_button" onClick={this.confirmAuth.bind(this, "I don't have it handy")}>I don't have it handy</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)

                        }
                        else if ((speech.includes("confirm the transaction summary")) || (speech.includes("confirm the transfer"))) {
                            addResponseMessage(speech)
                            this.setState({ hideTrans: false })
                            this.setState({ disable_confirm: false })
                            suggestionView = ({ color, handleClick }) =>
                                <div hidden={this.state.hideTrans}>
                                    <div className="container_div">
                                        <div className="transaction_summary_top_title">Transaction Summary</div>
                                        <div className="table-responsive">
                                            <table className="table transaction_summary_table_design">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2" className="align_center">Recipient Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Account Number</td>
                                                        <td>{this.state.accNo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Account Type</td>
                                                        <td>{this.state.accType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mobile Number</td>
                                                        <td>{this.state.mobileNum}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Full Name</td>
                                                        <td>{this.state.fullName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address</td>
                                                        <td>{this.state.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Transfer Reason</td>
                                                        <td>{this.state.reason}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2" className="align_center border_bottom sub_title">Bank Details</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Bank Name</td>
                                                        <td>{this.state.bank}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>IFSC Code</td>
                                                        <td>{this.state.ifsc}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>City</td>
                                                        <td>{this.state.city}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Branch Name</td>
                                                        <td>{this.state.branch}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2" className="align_center border_bottom sub_title">Transaction Details</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Amount to be Transferred</td>
                                                        <td>{this.state.amount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Conversion Rate INR 1</td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Fees and Charges</td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Cost</td>
                                                        <td>{this.state.amount}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" id="confirm" disabled={this.state.disable_confirm} onClick={this.confirmTrans.bind(this, "Confirm")}>Confirm</button>
                                            <button type="button" className="btn btn-primary" disabled={this.state.disable_confirm} onClick={this.editForm}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("nick name for this recipient")) {
                            var id = "nickname_form"
                            addResponseMessage(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <div className="form_top_title">Recipient details</div>
                                    <form className="well form-horizontal" id={id} name={id}>
                                        <fieldset>
                                            <div className="form-group">
                                                <label className="col-md-5">Nick Name</label>
                                                <div className="col-md-7">
                                                    <input type="text" className="form-control" id="nick_name" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-5">Account Number</label>
                                                <div className="col-md-7">
                                                    <input type="text" className="form-control" id="Acc_no" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-5">Mobile Number</label>
                                                <div className="col-md-7">
                                                    <input type="text" className="form-control" id="mbl_num" placeholder="" onChange={(event) => this.updateState(event)} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="transaction_summary_button_design">
                                                <button type="button" className="btn btn-primary" value="Save" id="ifsc_button" onClick={this.saveForm.bind(this, id)}>Save</button>
                                                <button type="button" className="btn btn-primary" id="ifsc_button" value="Not Interested" onClick={this.handleClick.bind(this, 'Not Interested')}>Not Interested</button>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>

                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("select the frequency")) {
                            var id = "frequency-form"
                            addResponseMessage(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <div className="form_top_title">Recipient details</div>
                                    <form className="well form-horizontal" id={id} name={id}>
                                        <fieldset>
                                            <div className="form-group">
                                                <label className="col-md-5">Frequency</label>
                                                <div className="col-md-7">
                                                    <select className="form-control" >
                                                        <option>Weekly</option>
                                                        <option>Monthly</option>
                                                        <option>Yearly</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="transaction_summary_button_design">
                                                <button type="button" className="btn btn-primary" value="Save" id="ifsc_button" onClick={this.saveForm.bind(this, id)}>Save</button>
                                                <button type="button" className="btn btn-primary" id="ifsc_button" value="Not Interested" onClick={this.handleClick.bind(this, 'Not Interested')}>Not Interested</button>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>

                            renderCustomComponent(suggestionView)
                        }
                        else if (speech.includes("total transfers to Mom this year")) {
                            this.splitNewline(speech)
                            var Highcharts = 'Highcharts';
                            var conf = {
                                chart: {
                                    type: 'column',
                                    backgroundColor: '#FCFFC5',
                                },
                                title: {
                                    text: 'Total money transferred to my Mom this year: INR 1025000'
                                },
                                navigation: {
                                    buttonOptions: {
                                        enabled: false
                                    }
                                },
                                credits: {
                                    enabled: false
                                },
                                xAxis: {
                                    type: 'category'
                                },
                                yAxis: {
                                    min: 0,
                                    max: 250000,
                                    tickPixelInterval: 50000,
                                    minTickInterval: 50000,
                                    categories: ['0', '50000', '100000', '150000', '200000', '250000'],
                                    title: {
                                        text: ''
                                    }

                                },
                                legend: {
                                    enabled: false
                                },
                                plotOptions: {
                                    series: {
                                        borderWidth: 0,
                                        dataLabels: {
                                            enabled: false,
                                            format: '{point.y:.1f}%'
                                        }
                                    }
                                },

                                series: [{
                                    name: 'Transaction',
                                    colorByPoint: true,
                                    data: [{
                                        name: 'Jan',
                                        y: 75000,
                                        drilldown: 'Jan'
                                    }, {
                                        name: 'Feb',
                                        y: 50000,
                                        drilldown: 'Feb'
                                    }, {
                                        name: 'Mar',
                                        y: 125000,
                                        drilldown: 'Mar'
                                    }, {
                                        name: 'Apr',
                                        y: 20000,
                                        drilldown: 'Apr'
                                    }, {
                                        name: 'May',
                                        y: 88000,
                                        drilldown: 'Jun'
                                    }, {
                                        name: 'Jul',
                                        y: 175000,
                                        drilldown: 'Jul'
                                    }]
                                }],

                            },

                                suggestionView = ({ color, handleClick }) =>
                                    // var Highcharts = 'Highcharts';
                                    <ChartView config={conf} onMessage={this.onMessage} ></ChartView>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("How much should I send this time")) {
                            var id = "Amount_form"
                            addResponseMessage(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <form className="well form-horizontal" action="#" target="_self" id={id}>
                                        <div className="form-group">
                                            <label className="col-md-2"><input type="radio" id="radio_01" name="amount" /></label>
                                            Usual amount(INR2,00,000)
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-1"><input type="radio" id="radio" name="amount" /></label>
                                            <div className="col-md-10">
                                                <input type="text" className="form-control" placeholder="another amount type in INR" />
                                            </div>
                                        </div>
                                        {/* <div className="radio">
                                            <label><input type="radio" id="radio" name="amount" /></label>
                                            <div className="col-md-7">
                                                <input type="text" className="form-control" placeholder="another amount type in INR" />
                                            </div>
                                        </div> */}
                                        <div id="amount_button" className="transaction_summary_button_design">
                                            <button type="button" className="btn btn-primary" value="Done" onClick={this.submit.bind(this, id, 'Done')} id="savePin">Done</button>
                                            <button type="button" className="btn btn-primary" value="Cancel" onClick={this.handleClick.bind(this, 'Cancel')}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (speech.includes("add a short description and click on confirm")) {
                            addResponseMessage(speech)
                            this.setState({ disable_confirm: false })
                            suggestionView = ({ color, handleClick }) =>
                                <div>
                                    <div className="container_div">
                                        <div className="transaction_summary_top_title">Complaint SR Form</div>
                                        <div className="table-responsive">
                                            <table className="table transaction_summary_table_design">
                                                <tbody>
                                                    <tr>
                                                        <td>TT reference number</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Date of transfer</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Amount of transfer</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Beneficiary account number</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Beneficiary bank name</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Channel of transaction</td>
                                                        <td>Self</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Direct remit to</td>
                                                        <td>India</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status of transaction</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Amount debited</td>
                                                        <td>Yes</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Description</td>
                                                        <td>Yes</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="transaction_summary_button_design">
                                        <button type="button" className="btn btn-primary" disabled={this.state.disable_confirm} onClick={this.confirmTrans.bind(this, "Confirm")}>Confirm</button>
                                    </div>
                                </div>
                            renderCustomComponent(suggestionView)
                        }
                        else if (speech.includes("complete the last conversation you had with me.")) {
                            this.splitNewline(speech)
                            suggestionView = ({ color, handleClick }) =>
                                <div className="button_text_list">
                                    <ul>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.conversation_continue.bind(this, intent)}>Yes</a></li>
                                        <li><a target="_self" href="javascript:void(0)" onClick={this.last_conversation.bind(this)}>No</a></li>
                                    </ul>
                                </div>
                            renderCustomComponent(suggestionView)
                        } else if (newMessage == "Terms & Conditions") {
                            this.state.modalIsOpen = true;
                            suggestionView = ({ color, handleClick }) =>
                                <Modal
                                    isOpen={this.state.modalIsOpen}
                                    onAfterOpen={this.afterOpenModal}
                                    onRequestClose={this.close_modal}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                    ariaHideApp={false}
                                >

                                    {/* <button onClick={this.close_modal}>close</button> */}
                                    <div className="tableModal-content">
                                        <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                                            <span className="tableClose">&times;</span>
                                        </button>
                                        <div className="customModal_body">
                                            <ul><li>You are required to abide by the following terms for the access to this website which are in addition to the General
                                                Terms and Conditions of Accounts and Banking Services (‘Account Terms’). By accessing this website you confirm your
                                                acknowledgement and acceptances of these terms and conditions. If you do not accept these terms and conditions, do
                                                not access the website and do not use the online services.
                                            </li>
                                                <li>
                                                    The contents of this web-site including, but not limited to the text, graphics, images, links and sounds are the property of
                                                    Emirates NBD Bank PJSC (‘ENBD’) and is protected by copyright. ENBD reserves all copyright, trademark, patent, intellectual and
                                                     other property rights in the information contained in this site. Any unauthorized use or reproduction of the information, materials
                                                     and proprietary rights contained in the ENBD site is strictly prohibited. The information and materials on this website and the terms,
                                                     conditions and descriptions that appear are subject to change without any further notice.
                                            </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div></div>
                                </Modal>
                            renderCustomComponent(suggestionView)
                        }
                        else if (newMessage == "Click to see the benefits of your Debit card") {
                            this.openModal()
                            suggestionView = ({ color, handleClick }) =>
                                <Modal
                                    isOpen={this.state.modalIsOpen}
                                    onAfterOpen={this.afterOpenModal}
                                    onRequestClose={this.close_modal}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                    ariaHideApp={false}
                                >

                                    {/* <button onClick={this.close_modal}>close</button> */}
                                    <div className="tableModal-content">
                                        <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                                            <span className="tableClose">&times;</span>
                                        </button>
                                        <div className="customModal_body">
                                            <ul>
                                                <li>
                                                    Your Visa Business Debit Card is as easy to use as a credit card and is accepted wherever you see the Visa logo.
                                                    Enjoy greater security with the latest CHIP and PIN technology, allowing you to use your card safely at millions
                                                    of retail outlets and ATMs worldwide.Cash is your past. Your Emirates NBD Visa Business Debit Card is your future.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div></div>
                                </Modal>
                            renderCustomComponent(suggestionView)
                        }
                        else if (newMessage == "Click to see where you can use your card") {
                            this.openModal();
                            suggestionView = ({ color, handleClick }) =>
                                <Modal
                                    isOpen={this.state.modalIsOpen}
                                    onAfterOpen={this.afterOpenModal}
                                    onRequestClose={this.close_modal}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                    ariaHideApp={false}
                                    id="modal"
                                >

                                    {/* <button onClick={this.close_modal}>close</button> */}
                                    <div className="tableModal-content">
                                        <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                                            <span className="tableClose">&times;</span>
                                        </button>
                                        <div className="customModal_body">
                                            <ul>
                                                <li>
                                                    Direct Debit facility − Sign up for the direct debit facility from your Bank Account with Emirates NBD which will ensure
                                                    that your Credit Card payments are cleared on your Card\'s due date. Call +971 600 540 000 and sign up today.
                                                    Any UAE Exchange Branch* − Simply visit any of the 79 conveniently located UAE Exchange branches and make a cash
                                                    payment towards your Emirates NBD Credit Card balance.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div></div>
                                </Modal>
                            renderCustomComponent(suggestionView)
                        }
                        else {
                            //method to display the response message
                            let split_text = speech.split("[newline]")
                            for (let index in split_text) {
                                if (split_text[index].includes("[suggestions]")) {
                                    let split_suggestions = split_text[index].split("[suggestions]")
                                    addResponseMessage(split_suggestions[0]);
                                    // to display various Suggestions
                                    let split_options = split_suggestions[1].split("__")
                                    for (let index in split_options) {
                                        suggestionView = ({ color, handleClick }) =>
                                            <div className="button_text_list">
                                                <ul>
                                                    <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, split_options[index])}>{split_options[index]}</a></li>
                                                </ul>
                                            </div>
                                        renderCustomComponent(suggestionView)
                                    }
                                } else if (split_text[index].includes("__")) {
                                    let split_credit = split_text[index].split("__")
                                    addResponseMessage(split_credit[0]);
                                }
                                else {
                                    addResponseMessage(split_text[index]);
                                }
                            }
                        }
                    }

                    //initialize the count
                    countDown = 0;

                });
            }
        }
    }
    //Response message section Ends here .......
    customComponent = (message) => {
        return (

            //method to display the response custom message
            renderCustomComponent(videoView, { color: "primary", handleClick: this.handleClick })
        );

    }

    handleClick(value) {
        console.log(value);
        var sendMsg = value;

        if (value != 'sign in') {
            addUserMessage(value);
        }

        this.handleNewUserMessage(sendMsg)

        //initialize the count
        countDown = 0;

    }

    addLinkSnippet = (url) => {
        return (

            //method to display the response custom message
            addLinkSnippet(url, { color: "primary", handleClick: this.handleClick, target: '_blank' })
        );

    }

    submit(id, value) {
        let form_object = window.document.forms[id]
        let elements = form_object.elements
        let form_data = []
        for (let i in elements) {
            console.log(elements[i])
            elements[i].disabled = true
            if (elements[i].value != "Done") {
                let object = { 'fields': elements[i].id, 'value': elements[i].value }
                form_data.push(object)
            } else if (elements[4].value == "Cancel") {
                elements[4].disabled = true;
                break;
            }
            else break;
        }
        this.handleClick(value)
        console.log(form_data)
    }
    saveForm(id) {
        let form_object = window.document.forms[id]
        let elements = form_object.elements
        let form_data = []
        for (let i in elements) {
            elements[i].disabled = true
            if (elements[i].value != "Save") {
                let object = { 'fields': elements[i].id, 'value': elements[i].value }
                form_data.push(object)
            }
            else break;
        }
        this.handleClick('Save')
    }

    updateState(e) {
        this.value = e.target.value
        const name = e.target.name;
        const value = e.target.value;
        console.log(name, value, 'n')
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let dateValid = this.state.dateValid;

        switch (fieldName) {
            case 'dob':
                dateValid = value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
                break;

            default:
                break;
        }
        console.log(dateValid, 'date')
        if (dateValid != null) {
            this.setState({
                dateValid: true,
            }, this.validateForm);
        }
    }

    validateForm() {
        console.log(Date())
        this.setState({ formValid: this.state.dateValid }, () => {
            this.setState(this.state)
        });
    }
    storeFiles(event, index, type) {
        let file = event.target.files
        document[index] = {
            type: type,
            file: file[0]
        }
        console.log(document, 'D')
        this.selectFile(event, index)
    }

    uploads() {
        let form_object = window.document.forms["upload_form"]
        let elements = form_object.elements
        let form_data = []
        window.document.getElementById("file_upload").disabled = true;
        window.document.getElementById("file_cancel").disabled = true;
        for (let i in elements) {
            console.log(elements[i].value)
            // elements[i].disabled = true
            if (elements[i].value != "Cancel") {
                let object = { 'fields': elements[i].id, 'value': elements[i].value }
                form_data.push(object)
            }
            else break;
        }
        console.log(document)
        document = []
        this.handleClick('Upload')
    }

    confirmAuth(value) {
        let form_object = window.document.forms['auth_form']
        let elements = form_object.elements
        for (let i in elements) {
            if (i < 3) elements[i].disabled = true;
        }
        this.handleClick(value)
        var auth_code = window.document.getElementById("auth_code").value
    }

    savePin(value) {
        let form_object = window.document.forms['pinChange_form']
        let elements = form_object.elements
        for (let i in elements) {
            if (i < 4) elements[i].disabled = true;
        }
        this.handleClick(value)
        var new_pin = window.document.getElementById("new_pin").value
    }

    apparel_1000(id_no) {
        // var id = "tableModal" + "_" + id_no;
        this.openModal();
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive" id="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Category</th>
                                            <th>Txn date/time</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Apparel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>100</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Apparel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>50</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Apparel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>50</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Apparel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>200</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">Total</td>
                                            <td>400</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        renderCustomComponent(suggestionView)

    }

    dining_1000(id_no) {
        this.openModal();
        // var id = "tableModal" + "_" + id_no;
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive" id="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Category</th>
                                            <th>Txn date/time</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Dining</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>20</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Dining</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>30</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Dining</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>40</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Dining</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">Total</td>
                                            <td>100</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        renderCustomComponent(suggestionView)

    }

    grocery_1000(id_no) {
        this.openModal();
        // var id = "tableModal" + "_" + id_no;
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive" id="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Category</th>
                                            <th>Txn date/time</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Grocery</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>20</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Grocery</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>30</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Grocery</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Grocery</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>40</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">Total</td>
                                            <td>100</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        renderCustomComponent(suggestionView)

    }

    travel_1000(id_no) {
        this.openModal();
        // var id = "tableModal" + "_" + id_no;
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive" id="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Category</th>
                                            <th>Txn date/time</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Travel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>100</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Travel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>100</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Travel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>50</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Travel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>150</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">Total</td>
                                            <td>400</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        //
        renderCustomComponent(suggestionView)

    }

    target_1000(id_no) {
        this.openModal();
        // var id = "tableModal" + "_" + id_no;
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive" id="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Category</th>
                                            <th>Txn date/time</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Target</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>800</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Dining</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>200</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Grocery</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>500</td>
                                        </tr>
                                        <tr>
                                            <td>XXXX</td>
                                            <td>Travel</td>
                                            <td>12/3/2018 2.00</td>
                                            <td>500</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">Total</td>
                                            <td>2000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        renderCustomComponent(suggestionView)

    }

    validateAuth(event) {
        var authCode = event.target.value
        var disable_form = window.document.getElementById("auth_button")
        if (authCode == otp) {
            confirm_auth = false;
            disable_form.disabled = false;
        }
        else disable_form.disabled = true;
    }
    newPin(event) {
        new_pin = event.target.value
    }
    confirmPin(event) {
        var pin = event.target.value
        var disable_form = window.document.getElementById("savePin")
        if (new_pin == pin) {
            showSavePin = false;
            disable_form.disabled = false;
        }
        else disable_form.disabled = true;
    }

    showModal(card_no) {
        this.openModal();
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="customModal_body">
                        <ul>
                            <li>Every purchase now earns you skyward miles.
                                With the Emirates World credit card you earn miles on every transaction.
                                Enjoy golf privileges, complimentary airport lounge access, shopping perks and more.
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        renderCustomComponent(suggestionView)

    }

    showrates() {
        this.openModal();
        suggestionView = ({ color, handleClick }) =>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.close_modal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                {/* <button onClick={this.close_modal}>close</button> */}
                <div className="tableModal-content">
                    <button type="buton" className='tableClose-modal' onClick={this.close_modal}>
                        <span className="tableClose">&times;</span>
                    </button>
                    <div className="tableModal_body">
                        <div className="container_div">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped chat_table_design">
                                    <thead>
                                        <tr>
                                            <th>Head</th>
                                            <th>ENBD</th>
                                            <th>Western Union</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Transfer amount(INR)</td>
                                            <td>200000</td>
                                            <td>200000</td>
                                        </tr>
                                        <tr>
                                            <td>Exchangerate 1AED=INR</td>
                                            <td>17.315</td>
                                            <td>17.345</td>
                                        </tr>
                                        <tr>
                                            <td>Commission fees(AED)</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td>Total cost of transfer(AED)</td>
                                            <td>11550.6786</td>
                                            <td>11540.70049</td>
                                        </tr>
                                        <tr>
                                            <td>Time taken for transfer</td>
                                            <td>60 minutes</td>
                                            <td>24 to 48hours</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        renderCustomComponent(suggestionView)

    }

    disableCardForm(value) {
        let form_object = window.document.forms['cardNo_form']
        let elements = form_object.elements
        for (let i in elements) {
            if (i < 3) elements[i].disabled = true;
        }
        this.handleClick(value)

    }
    close_widget() {
        this.deleteContexts(user)
        toggleWidget();
        dropMessages();
    }
    /**********************************************Image Slide functions******************************** */
    // Next/previous controls
    plusSlides(n) {
        this.showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    currentSlide(n) {
        this.showSlides(slideIndex = n);
    }

    showSlides(n) {
        var i;
        var image = window.document.getElementById("initial").style.display = "none"
        var slides = window.document.getElementsByClassName("mySlides");
        console.log(slides.length, 'L')
        var dots = window.document.getElementsByClassName("dot");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        if (slides.length > 0) {
            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
        }
    }
    // ***************************Contexts Starts****************************************************************

    storeContexts(contexts, intent, user_name) {
        if (intent != "lastconversation") {
            if (contexts != "") {
                var url = "http://developer.star-systems.in:14050/store?device_id=" + user_name + "&intent_name=" + intent + "&context=" + contexts.toString() + "&source=web"
                axios.post(url)
                    .then(response => console.log(response, "Store"))
            }
        }
    }
    deleteContexts(user_name) {
        var url = "http://developer.star-systems.in:14050/deletedata?device_id=" + user_name
        axios.post(url)
            .then(response => console.log(response, "Delete"))
    }
    getContexts() {
        var context_array = [];
        var url = "http://developer.star-systems.in:14050/getdata?device_id=" + user
        axios.get(url)
            .then(response => {
                console.log(response, 'res')
                if ("contexts" in response.data) {
                    if (response.data.contexts != "") {
                        intent = response.data.intentName;
                        var context = response.data.contexts.split(',')
                        for (let i in context) {
                            let object = { name: context[i] }
                            context_array.push(object)
                        }
                        console.log(context_array)
                    }
                    if (context_array.length != 0) {
                        this.apiAiClient.setContexts(context_array, intent).then((response) => {
                            if (response) {
                                this.handleNewUserMessage("lastconversation")
                                toggleWidget();
                            }
                        })
                    }
                    else {
                        this.handleNewUserMessage("welcome")
                    }
                }
                else {
                    this.handleNewUserMessage("welcome")
                }
            })
    }
    // *********************************Contexts Ends******************************************************************
    splitNewline(speech) {
        console.log(speech, 'Newline')
        let split_test = speech.split("[newline]")
        console.log(split_test, 'S')
        for (let i in split_test) {
            if (split_test[i].includes("[suggestions]")) {
                let split_suggestions = split_test[i].split("[suggestions]")
                addResponseMessage(split_suggestions[0])
            }
            else addResponseMessage(split_test[i]);
        }
    }
    splitSuggestion(speech) {
        if (speech.includes("[suggestions]")) {
            let split_suggestions = speech.split("[suggestions]")
            // to display various Suggestions
            if (split_suggestions[1].includes("__")) {
                let split_options = split_suggestions[1].split("__")
                for (let index in split_options) {
                    suggestionView = ({ color, handleClick }) =>
                        <div className="button_text_list">
                            <ul>
                                <li><a target="_self" href="javascript:void(0)" onClick={this.handleClick.bind(this, split_options[index])}>{split_options[index]}</a></li>
                            </ul>
                        </div>
                    renderCustomComponent(suggestionView)
                }
            }
        }
    }
    openModal() {
        this.setState({ modalIsOpen: true })
    }
    close_modal() {
        this.setState({ modalIsOpen: false })
        console.log(this.state.modalIsOpen, 'M')
        addResponseMessage("")
    }
    last_conversation() {
        console.log("last")
        dropMessages();
        this.handleNewUserMessage('No')
        this.deleteContexts(user);
    }
    conversation_continue(value) {
        dropMessages();
        this.handleNewUserMessage(value)
    }

    selectFile(input, index) {
        if (input.target.files && input.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var file = e.target.result
                if (index == 0)
                    window.document.getElementById("upload_image").src = file
                else
                    window.document.getElementById("upload_image2").src = file
            }
            reader.readAsDataURL(input.target.files[0]);
        }
    }

    confirmTrans(value) {
        this.setState({ disable_confirm: true })
        this.handleClick(value)
    }
    editForm() {
        this.setState({ hideEditForm: false, hideTrans: true })
        suggestionView = ({ color, handleClick }) =>
            <div hidden={this.state.hideEditForm}>
                <div className="container_div">
                    <div className="transaction_summary_top_title">Transaction Summary</div>
                    <div className="table-responsive">
                        <table className="table transaction_summary_table_design">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="align_center">Recipient Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Account Number</td>
                                    <td><input type="text" class="form-control" name="accNo" defaultValue={this.state.accNo} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Account Type</td>
                                    <td><input type="text" class="form-control" name="accType" defaultValue={this.state.accType} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Mobile Number</td>
                                    <td><input type="text" class="form-control" name="mobileNum" defaultValue={this.state.mobileNum} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Full Name</td>
                                    <td><input type="text" class="form-control" name="fullName" defaultValue={this.state.fullName} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><input type="text" class="form-control" name="address" defaultValue={this.state.address} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Transfer Reason</td>
                                    <td><input type="text" class="form-control" name="reason" defaultValue={this.state.reason} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="align_center border_bottom sub_title">Bank Details</td>
                                </tr>
                                <tr>
                                    <td>Bank Name</td>
                                    <td><input type="text" class="form-control" name="bank" defaultValue={this.state.bank} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>IFSC Code</td>
                                    <td><input type="text" class="form-control" name="ifsc" defaultValue={this.state.ifsc} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>City</td>
                                    <td><input type="text" class="form-control" name="city" defaultValue={this.state.city} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Branch Name</td>
                                    <td><input type="text" class="form-control" name="branch" defaultValue={this.state.branch} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="align_center border_bottom sub_title">Transaction Details</td>
                                </tr>
                                <tr>
                                    <td>Amount to be Transferred</td>
                                    <td><input type="text" class="form-control" name="amount" defaultValue={this.state.amount} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                                <tr>
                                    <td>Conversion Rate INR 1</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>Fees and Charges</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>Total Cost</td>
                                    <td><input type="text" class="form-control" name="amount" defaultValue={this.state.amount} onChange={(event) => this.updateState(event)} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="transaction_summary_button_design">
                        <button type="button" className="btn btn-primary" id="confirm" onClick={this.saveTransaction.bind(this)}>Save</button>
                        {/* <button type="button" className="btn btn-primary" onClick={this.saveTransaction.bind(this)}>Cancel</button> */}
                    </div>
                </div>
            </div>
        renderCustomComponent(suggestionView)
    }
    saveTransaction() {
        this.setState({ hideTrans: false, hideEditForm: true })
        addResponseMessage("")
    }


    render() {

        return (
            <div className="App">
                <Widget
                    title="ENBD Chat"
                    subtitle=""
                    senderPlaceHolder="Please type a message"
                    showCloseButton={true}
                    renderCustomComponent={this.renderCustomComponent}
                    handleNewUserMessage={this.handleNewUserMessage}
                    closeWidget={this.closeWidget}

                />
                {/* <div hidden={this.state.showCloseIcon}>
                    <button className="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" onClick={this.closeChat}>
                        <img src={Close} />
                    </button>
                </div> */}
            </div>
        );
    }

}

export default App;
