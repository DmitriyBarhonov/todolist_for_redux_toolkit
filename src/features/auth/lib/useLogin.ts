import { FormikHelpers, useFormik } from "formik"
import { LoginParamsType } from "../auth-api"
import { BaseResponseType } from "../../../common/types"
import { useAppDispatch } from "../../../common/hooks/useAppDispatch"
import { login } from "../auth-reducer"

export const useLogin = () => {
    const dispatch = useAppDispatch()
    const formik = useFormik({
        validate: (values) => {

            if (!values.email) {
                return {
                    email: 'Email is required'
                }
            }
            if (!values.password) {
                return {
                    password: 'Password is required'
                }
            }

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },

        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(login({ values }))
                .unwrap()
                .catch((res: BaseResponseType) => {
                    console.log(res);
                    res.fieldsErrors?.forEach((fieldsErrors) => {
                        formikHelpers.setFieldError(fieldsErrors.field, fieldsErrors.error)
                    })


                })
        },
    })
    return { formik }
}