import React, { useState, useEffect } from "react";
import Error from "../Error";
import { DataItem, Categories, ErrorDataItem, Data } from "../../dataUtilities";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import app from "../../Firebase/firebaseConfig";

import styles from "./dashboard.module.scss";



const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase storage
const applicantCollectionRef = collection(db, 'applicant');
const imageRef = ref(storage, 'table-row-edit.png'); 
const callToActionImgInit = ref(storage, 'call-to-action.png'); 

const myJsonData = {
    "shopperStatus": 1,
    "applicantDetails": {
        "applicantType": "Primary",
      "employerName": "General Motors",
      "grossMonthlyIncome": "$2,000",
      "identityVerification": "true",
      "incomeType": "W2",
      "primaryIncomeDataSource": "ADP",
      "secondaryIncomeDataSource": "Wells Fargo Bank"
    },
    "desiredMovein": serverTimestamp(),
    "unitsize": 3,
    "xmaxRent": 1.5,
    "lastName": "Josephs",
    "coApplicant": {
      "lastName": "chambers",
      "firstName": "Broderick"
    },
    "firstName": "Daniel",
    "xminRent": 6,
    "preapprovalDate": serverTimestamp(),
  }


const Dashboard = () => { 
  const [data, setData] = useState([]); 
  const [editTableImg, setEditTableImg] = useState([]);     
  const [callToActionImg, setCallToActionImg] = useState([]);     

  const addDocumentFunction = () =>{
    addDoc(applicantCollectionRef, myJsonData)
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  }

  const formatDate = (dateToFormat) => {
    if (dateToFormat instanceof Date) { 
      // Date object 
      return dateToFormat.toLocaleDateString(); // Customize with options below
    } else if (typeof dateToFormat === 'string') {
       // Assumes it's a string representation
       return dateToFormat; //  If needed, parse the string into a Date object here
    } else {
      // Assuming a Firestore Timestamp
    //   console.log(`Date to format: ${dateToFormat}`)
      return dateToFormat.toDate().toLocaleDateString(); 
    }
  };
  
  useEffect(() => {
    console.log("mounted ")
    const onsub = onSnapshot(collection(db, "applicant"), (snapshot) => {
        const constructedData = snapshot.docs.map((doc)=> doc.data());
        setData(constructedData);
    }, (error) => {
        // Code to handle errors
    });
    // Gets edit-table-image URL from firebase storage bucket
    getDownloadURL(imageRef)
        .then((url) => {
            // console.log("Download URL:", url);
            setEditTableImg(url)
        })
        .catch((error) => {
            // console.error("Error getting download URL:", error);
        });
        getDownloadURL(callToActionImgInit)
        .then((url) => {
            // console.log("call-to-action URL:", url);
            setCallToActionImg(url)
        })
        .catch((error) => {
            console.error("Error getting download URL:", error);
        });
    
    // const fetchData = async () => {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "applicant"));
    //     const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc }));
    //     setData(fetchedData);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }; fetchData();
    return onsub;
  }, []);  

  return (
    <>
      <table className={styles.container} cellSpacing="0" cellPadding="0">
        <tbody>
            <tr className={styles.tableHeader}>
                <td></td>
                <td>Primary Applicant</td>
                <td>Co-Applicant</td>
                <td>Shopper Status</td>
                <td>Pre-Approval Date</td>
                <td>Desired Move In</td>
                <td>Unit Size</td>
                <td>XMin Rent</td>
                <td onClick={()=>{addDocumentFunction()}}>XMax Rent</td>
            </tr>
          {data.map((doc) => (
            <>
                {console.log(data)}
                <tr key={doc.id} className={styles.tableValues}> 
                    <td className={styles.editTableCell}><img className={styles.editTableImg} src={editTableImg}></img></td>
                    <td>{doc.firstName} {doc.lastName}</td>
                    <td>{doc.coApplicant.firstName} {doc.coApplicant.lastName}</td>
                    <td>{doc.shopperStatus === 1 ?  <div className={styles.blue}></div> : <div className={styles.red}></div>}</td>
                    <td>{formatDate(doc?.preapprovalDate)}</td>
                    <td>{formatDate(doc?.desiredMovein)}</td>
                    <td>{doc.unitsize}</td>
                    <td>{doc.xminRent}</td>
                    <td>{doc.xmaxRent}</td>
                </tr>
                {doc.applicantDetails  && 
                    <tr className={styles.tableDetails}>
                        <td colspan="9" className={doc.applicantDetails ? styles.applicantDetailsContainer : ''}>
                            <div>
                                <div className={styles.applicantDetailsName}>
                                    <div className="|">{doc.firstName} {doc.lastName}</div>
                                </div>
                                <div className={styles.applicantType}>
                                    <div className={styles.applicantType}>{doc.applicantDetails.applicantType} Applicant</div>
                                </div>
                                <div>
                                    <img className={styles.callToActionImg} src={callToActionImg}></img>
                                </div>
                                <div className={styles.applicantDetailsValuesContainer}>
                                    <div className={styles.detailsRow}>
                                        <div className={styles.left}>
                                            <div className={styles.applicantDetailTitle}>Gross Monthly Income</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.grossMonthlyIncome}</div>
                                            <div className={styles.applicantDetailSubTitle}>as of 3/02/2024</div>
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.applicantDetailTitle}>Income Type</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.incomeType}</div>
                                            <div className={styles.applicantDetailSubTitle}>From Payroll Source</div>
                                        </div>
                                    </div>
                                    <div className={styles.detailsRow}>
                                        <div className={styles.left}>
                                            <div className={styles.applicantDetailTitle}>Employer Name</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.employerName}</div>
                                            <div className={styles.applicantDetailSubTitle}>as of 12/02/2019</div>
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.applicantDetailTitle}>Identity Verification</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.identityVerification}</div>
                                        </div>
                                    </div>
                                    <div className={styles.detailsRow}>
                                        <div className={styles.left}>
                                            <div className={styles.applicantDetailTitle}>Primary Income Data Source</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.primaryIncomeDataSource}</div>
                                            <div className={styles.applicantDetailSubTitle}>as of 12/02/2019</div>
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.applicantDetailTitle}>Primary Income Data Source</div>
                                            <div className={styles.applicantDetailValue}>{doc.applicantDetails?.secondaryIncomeDataSource}</div>
                                            <div className={styles.applicantDetailSubTitle}>as of 12/02/2019</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                }
            </>
        ))}
        </tbody>
      </table>
    </>
  );
};

Dashboard.displayName = "Dashboard";

export default Dashboard;
