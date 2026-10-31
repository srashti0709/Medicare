from fastapi import APIRouter
from pydantic import BaseModel

from ml.kidney_predict import predict_kidney_disease


router = APIRouter(
    prefix="/api/kidney",
    tags=["Kidney Disease Prediction"]
)


class KidneyInput(BaseModel):
    age: float
    bp: float
    sg: float
    al: float
    su: float
    rbc: str
    pc: str
    pcc: str
    ba: str
    bgr: float
    bu: float
    sc: float
    sod: float
    pot: float
    hemo: float
    pcv: float
    wbcc: float
    rbcc: float
    htn: str
    dm: str
    cad: str
    appet: str
    pe: str
    ane: str


@router.post("/predict")
def kidney_prediction(data: KidneyInput):

    patient_data = [
        data.age,
        data.bp,
        data.sg,
        data.al,
        data.su,
        data.rbc,
        data.pc,
        data.pcc,
        data.ba,
        data.bgr,
        data.bu,
        data.sc,
        data.sod,
        data.pot,
        data.hemo,
        data.pcv,
        data.wbcc,
        data.rbcc,
        data.htn,
        data.dm,
        data.cad,
        data.appet,
        data.pe,
        data.ane
    ]

    return predict_kidney_disease(patient_data)