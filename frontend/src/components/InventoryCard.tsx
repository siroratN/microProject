// CardComponent.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

// Define the props that this component will accept
interface CardComponentProps {
  name: string;
  description: string;
  image: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ name, description, image }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image} // Dynamic image URL
          alt={name} // Dynamic alt text
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name} {/* Dynamic name */}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description} {/* Dynamic description */}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardComponent;
