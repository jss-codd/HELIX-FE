import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useHistory ,useLocation} from "react-router-dom";
import { Divider, Spin, message, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useFetch from "@app/util/useFetch";
import AnalyticIcon from "@images/icons/analytics.svg";
import { connect } from "react-redux";
import axios from "axios";
import ReactJson from 'react-json-view'
import socketio from "socket.io-client";


const Analytics = ({ activeIndex, setActiveIndex }) => {
  const history = useHistory();
  const [totalDetections, setTotalDetections] = useState(0);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [showModel, setShowModel] = useState(false)
  const [showloader, setShowLoader] = useState(false)
  const [sensorData, setSensorData] = useState([])
  const [intervalId, setIntervalId] = useState(null)
  const [topicList, setTopicList] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  
  const { loading, data: washrooms, fetchData: getWashrooms } = useFetch({
    url: `${process.env.API_URL}/washrooms`, // http://xx.xx.xx.xx:8081/api/washrooms
    method: "GET",
    onSuccess: (data) => {
      const fromDate = moment().subtract(7, "days");
      const roomId = data.filter((wr) => wr.sensors.length > 0)[0]?._id;
      setFormInitialValues({
        washroom: roomId,
        fromDate,
        toDate: moment(),
      });
      if (roomId) {
        getPredictions({
          washroom: roomId,
          fromDate,
          toDate: moment(),
        });
      }
    },
  });

  const {
    loading: loadingData,
    data: predictionData,
    fetchData: getPredictions,
  } = useFetch((params) => ({
    url: `${process.env.API_URL}/washrooms/predict`,
    method: "POST",
    body: JSON.stringify(params),
    onSuccess: (data) => {
      const total_people_count = data.washroom.reduce(
        (a, b) => a + Number(b.occupancylasthour),
        0
      );
      setTotalDetections(total_people_count * 2);
    },
    onError: (error) => {
      message.error(error);
    },
  }));


  useEffect(() => {
    if(selectedId!==null && topicList.length >0){
      let topic = topicList.filter(d=>{
        if(d._id===selectedId)
        return d.topic
      })[0].topic

      const accessToken = localStorage.getItem("accessToken");
      const socket = socketio.connect(
        process.env.REACT_APP_SERVER_URL,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      socket.on("connected", function (data) {
        // socket.emit("ready for data", {});
      });
      socket.on(topic, function (data) {
        
       
        setSensorData(JSON.parse(data));
      });

    }
  
  }, [selectedId]);
  

  const getPublishTopicList = async () => {
    const localDevice_Id = deviceId ;
    const accessToken = localStorage.getItem("accessToken");
    const pub_list = await axios.get(`${process.env.API_URL}/publish_data/${localDevice_Id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
     setTopicList(pub_list.data)
  }

  useEffect(() => {
    getWashrooms();
    getPublishTopicList()
  }, []);

  const onSubmit = useCallback(
    (values) => {
      getPredictions(values);
    },
    [getPredictions]
  );

  const getSensorData = async () => {
    setShowLoader(true)
    const accessToken = localStorage.getItem("accessToken");
    
      const sensor_data = await axios.get(`${process.env.API_URL}/sensor_data/pub_data/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  }

  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={AnalyticIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Analytics
          </h2>
        </div>
        <div
          className="d-flex justify-content-end"
          style={{ position: "absolute", top: 0, right: 16 }}
        >
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowLeftOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex < 1}
            onClick={() => setActiveIndex(activeIndex - 1)}
          />
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowRightOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex > 2}
            onClick={() => setActiveIndex(activeIndex + 1)}
          />
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      {/* <Formik
        initialValues={formInitialValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isValid, values }) => (
          <Form layout="vertical" className="mt-4">
            <div className="row">
              <div className="col col-md-2 col-lg-1 font-weight-bold text-left text-md-right">
                Search:
              </div>
              <div className="col col-md-3">
                <Form.Item
                  name="washroom"
                  validate={(value) => !value && "Please select washroom"}
                  hasFeedback
                >
                  <Select
                    name="washroom"
                    placeholder="Washroom"
                    style={{ width: "100%" }}
                    options={washrooms
                      ?.filter((w) => w.sensors?.length > 0)
                      .map((wr) => ({
                        label: `${wr.type.toUpperCase()}, ${wr.floor?.description}, ${wr.floor?.infrastructure?.name}`,
                        value: wr._id,
                      }))}
                  />
                </Form.Item>
              </div>
              <div className="col col-md-3">
                <Form.Item
                  name="fromDate"
                  validate={(value) => {
                    if (!value) return "Please select start date";
                    if (moment(value).isAfter(values.toDate, "day"))
                      return "Start date cannot greater than or equal end date";
                    return undefined;
                  }}
                  hasFeedback
                >
                  <DatePicker
                    name="fromDate"
                    placeholder="From Date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col col-md-3">
                <Form.Item
                  name="toDate"
                  validate={(value) => {
                    if (!value) return "Please select end date";
                    if (moment(value).isBefore(values.fromDate))
                      return "End date cannot smaller than or equal start date";
                    return undefined;
                  }}
                  hasFeedback
                >
                  <DatePicker
                    name="toDate"
                    placeholder="To Date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col col-md-2">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  disabled={!isValid || loading || loadingData}
                  loading={loading || loadingData}
                >
                  Submit
                </Button>





              </div>
            </div>
            <div style={{ width: "100%", display: 'flex', justifyContent:"flex-end" ,alignItems:'flex-end'}}>

              <div style={{display: 'flex',justifyContent:"space-between"}}>
                <Select
                  name=" Topic "
                  placeholder="Topic"
                  onChange={(value) =>{ setSelectedId(value)}}
                  style={{ width: "300px", marginRight:"20px"}}
                  disabled={topicList.length ===0?true:false}

                >
                  {topicList.length >0 &&
                    topicList?.map((dt, idx) => (
                      <Select.Option
                        value={dt._id}
                        key={idx}
                      // onChange={(value) => handleOnChange(value)}
                      >
                        {dt.topic}
                      </Select.Option>
                    ))}
                </Select>

                <Button
                  type="default"
                  block
                  onClick={() => { setShowModel(true); getSensorData() }}
                  disabled={selectedId!==null?false:true}

                >
                  View subscribed data
                </Button>
                <Button
                  type="default"
                  block
                  onClick={() => { history.push("/wellness/chart"); }}
                 

                >
                  Plotly Dashboard
                </Button>
              </div>




            </div>



          </Form>
        )}
      </Formik>

      {loadingData ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: 400 }}
        >
          <Spin />
          <h5>Fetching data from server ...</h5>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col col-sm-6 col-lg-3">
              <BorderLeftCard
                title="TOTAL NUMBER OF DETECTIONS"
                value={totalDetections}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <CumulativeReport washroomData={predictionData?.washroom} />
            </div>
            <div className="col-lg-6 mb-3">
              <AirQualityChart washroomData={predictionData?.washroom} />
            </div>
            <div className="col-lg-6 mb-3">
              <NumberOfDetections washroomData={predictionData?.washroom} />
            </div>
            <div className="col-lg-6 mb-3">
              <VocChannel washroomData={predictionData?.washroom} />
            </div>
            <div className="col-lg-6 mb-3">
              <PeopleCountTrend
                washroomData={predictionData?.washroom}
                peopleCountTrendData={predictionData?.people_count}
              />
            </div>
            <div className="col-lg-6 mb-3">
              <AirQualityTrend
                washroomData={predictionData?.washroom}
                trendData={predictionData?.iaq_forecast}
              />
            </div>
          </div>
        </>
      )}

      <div>

        <Modal isOpen={showModel} centered={true} size={'lg'} >
          <ModalHeader>Sensor Data</ModalHeader>
          <ModalBody style={{ minHeight: "400px" }} >
            <div style={{ height: "400px", overflow: "scroll" }}>
            
              {typeof (sensorData) !== null && <ReactJson src={sensorData} />}

            </div>


          </ModalBody>
          <ModalFooter>
            

            <Button color="secondary" onClick={() => { setShowModel(false); clearInterval(intervalId) }} >Cancel</Button>
          </ModalFooter>
        </Modal>
      </div> */}



    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    deviceId: state.sensorDeviceReducer.deviceId
  };
};
// export default LineChart;
export default connect(mapStateToProps, null)(Analytics);

// export default Analytics;