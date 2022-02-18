import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export default function CovidCard(props) {
  return (
    <Card sx={{ minWidth: 150 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.subTitle}
        </Typography>
        <Typography variant="h5" component="div">
            {props.title}
        </Typography>
        <Typography variant="body2">
            Confirmed: {props.confirmed}
        </Typography>
        <Typography variant="body2">
            Deaths: {props.deaths}
        </Typography>
      </CardContent>
    </Card>
  );
}

// import * as React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';

// export default function CovidCard(props) {
//   return (
//     <Card sx={{ minWidth: 180 }}>
//       <CardContent>
//         <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//           {props.subTitle}
//         </Typography>
//         <Typography variant="h5" component="div">
//           {props.title}
//         </Typography>
//         <Typography variant="body2">
//           Confirmed: {props.confirmed}
//         </Typography>
//         <Typography variant="body2">
//           Deaths: {props.deaths}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// }
