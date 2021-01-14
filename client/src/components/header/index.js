import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export default function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="/">Market</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/brands">Brands</Nav.Link>
          <Nav.Link href="/categories">Categories</Nav.Link>
        </Nav>

        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    </header>
  );
}
