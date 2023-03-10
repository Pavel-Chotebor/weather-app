import {Autocomplete, Box, Button, Paper, Snackbar, TextField, Typography} from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setCityDetail, useGetCitiesQuery} from "../../redux";
import {City} from "../../models";
import {useDebounce} from "../hooks/useDebounce";
import {WeatherFavoriteCity} from "./WeatherFavoriteCity";

const DEFAULT_DATA_VALUE: any[] = []

export const WeatherCitySelect = (): JSX.Element => {
    const [cityQuery, setCityQuery] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [cityDetailObj, setCityDetailObj] = useState<City | null>(null)
    const debounceValue = useDebounce(cityQuery, 300)

    const {data, isLoading} = useGetCitiesQuery(debounceValue, {skip: !debounceValue})
    const dispatch = useDispatch()

    //saving city detail to redux
    const onDispatch = () => {
        dispatch(setCityDetail(cityDetailObj))
        setIsAlertOpen(true)
    }

    return (
        <Paper style={{padding: "4rem", borderRadius: 10}}>
            <Box display="flex" flexDirection="column" alignItems="center" alignContent="center">
                <Typography style={{marginBottom: "1rem"}} variant="h5">SELECT CITY</Typography>
                <Autocomplete
                    id="city"
                    loading={isLoading}
                    options={data || DEFAULT_DATA_VALUE}
                    getOptionLabel={(option: City) => option.LocalizedName}
                    onChange={(e, value) => setCityDetailObj(value as City)}
                    sx={{width: 300}}
                    //in real project i would use react hook form library for handling forms
                    renderInput={
                        (params) =>
                            <TextField
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                                {...params}
                                label="City"
                            />
                    }
                />
                <Button
                    style={{margin: "1rem"}}
                    disabled={!cityDetailObj}
                    variant="contained"
                    onClick={onDispatch}
                    endIcon={<FavoriteIcon/>}
                >
                    Set favorite city
                </Button>

                {!!cityDetailObj && (
                    <Paper style={{padding: "2rem 10rem", borderRadius: 10, backgroundColor: "#FAFAFA"}}>
                        <Box style={{marginTop: "2rem"}}>
                            <WeatherFavoriteCity deleteButton={false} cityDetail={cityDetailObj}/>
                        </Box>
                    </Paper>
                )}

                <Snackbar
                    open={isAlertOpen}
                    onClose={() => setIsAlertOpen(false)}
                    autoHideDuration={3000}
                    message="Saved"
                />
            </Box>
        </Paper>
    )
}