"use client";
import { Grid, Typography } from "@mui/material";
import { MainCard } from "shared-ui/src";
import PreviousVisits from "./components/previousVisits";
import TemplateForms from "./components/templateForms";
import { AdminNav } from "./components/adminNav";
import { PatientDetails } from "./components/patientDetails";
import PatientNav from "./components/patientNav";

export default function Profile() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={2} md={4} lg={3}>
        <MainCard elevation={3}>
          <PreviousVisits />
        </MainCard>
        <MainCard elevation={3}>
          <TemplateForms />
        </MainCard>
      </Grid>
      <Grid item xs={3} md={7} lg={9}>
        <MainCard sx={{ justifyContent: "right" }}>
          <AdminNav username="John Doe" />
        </MainCard>
        <MainCard sx={{ border: "none" }}>
          <PatientDetails name="James Doe" />
        </MainCard>
        {<PatientNav />}
        <MainCard sx={{ marginTop: "5dp" }}>
          <Typography>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nunc vel
            nisi eget metus cursus rutrum vel ac massa. Vestibulum consequat leo
            quis felis venenatis volutpat. Aliquam eget odio consequat, sodales
            leo at, aliquet mi. Aenean maximus velit nec tellus posuere,
            vehicula hendrerit felis venenatis. Suspendisse ultrices vehicula
            justo, nec laoreet eros volutpat quis. Pellentesque nec lacus nec
            risus tempor laoreet vestibulum at nunc. Nam sagittis metus accumsan
            aliquet vestibulum.Donec varius enim ac massa pretium, id pharetra
            magna suscipit. Fusce vestibulum sapien non felis sagittis vehicula.
            Ut a augue mattis, tincidunt risus eget, molestie mauris. Proin
            posuere, justo eget egestas commodo, augue urna sodales elit, ac
            pellentesque lorem dui at eros. Ut turpis enim, scelerisque ut elit
            ac, lobortis molestie elit. Vivamus ut suscipit mauris, ac euismod
            turpis. Donec id scelerisque urna. In gravida pretium erat a
            sagittis.Proin dictum metus ac purus lobortis egestas. Mauris
            aliquam, purus hendrerit lobortis iaculis, erat tortor vestibulum
            ipsum, ut dictum nibh erat ac diam. Aliquam et erat et orci euismod
            congue id quis nisl. Proin id sagittis tellus. Sed pulvinar
            hendrerit rhoncus. Donec tincidunt tempor orci, at volutpat ligula
            varius in. Donec luctus, tellus id porta efficitur, purus ex
            dignissim velit, quis accumsan tellus turpis eu odio. Maecenas
            lacinia erat at nisl viverra sagittis. Interdum et malesuada fames
            ac ante ipsum primis in faucibus. Curabitur malesuada ullamcorper
            auctor. In hac habitasse platea dictumst.Etiam tempor nunc ac
            eleifend elementum. In efficitur diam consectetur quam gravida
            pulvinar. Maecenas quis velit quam. Sed tortor orci, molestie nec
            congue ac, maximus sit amet risus. Proin orci neque, maximus gravida
            ex et, tincidunt ultricies tellus. Aliquam consequat augue sit amet
            neque suscipit varius. Integer quis est et nulla accumsan tincidunt
            non quis ante. Nam id justo malesuada, malesuada lorem non,
            ullamcorper ex. Maecenas nisi enim, ultricies sed varius ac, mattis
            scelerisque augue. Sed pulvinar aliquet molestie. Fusce eget tellus
            et libero facilisis blandit. Phasellus eget eleifend justo. Morbi
            dapibus cursus lacinia. Nunc sit amet euismod risus.Phasellus eu
            arcu porttitor, facilisis ante sed, malesuada lorem. In accumsan
            massa id odio auctor, ut consectetur enim maximus. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Ut non porttitor lorem, at consequat arcu. Nulla a
            egestas felis. Suspendisse at pellentesque neque. Ut sed nunc a
            tortor eleifend lacinia ut a neque. Proin finibus nisi dolor, non
            elementum ante lacinia eu. Etiam consectetur lorem pharetra placerat
            dignissim. Vivamus sapien tellus, mattis ut nibh eget, lacinia
            auctor justo. Phasellus porta finibus orci. Nam velit dui, ornare
            non justo at, rhoncus dictum nibh
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
