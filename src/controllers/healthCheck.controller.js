
async function healthCheck(req, res) {
  try {
    return res.status(200).json({
      status: "Ok",
      message: "Everything is good!"
    });
  } 
  catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internel Server Error!"
    });
  }
}


export default {
  healthCheck
}