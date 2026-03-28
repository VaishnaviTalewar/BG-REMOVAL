import jwt from "jsonwebtoken"


//middleware func to decode jwt token to get clerk id

export const authUser = async (req, res, next) => {
    try {

        const { token } = req.headers

        if (!token) {
            return res.json({ success: false, message: "Not valid login again" });
        }

        const token_decode = jwt.decode(token)
        req.body.clerkId = token_decode.clerkId
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

